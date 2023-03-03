package com.glaze.qrlogin.configuration.security.filters

import com.glaze.qrlogin.configuration.security.tokens.SuccessfulAuthenticationToken
import com.glaze.qrlogin.configuration.security.contracts.UserToUserDetailsAdapter
import com.glaze.qrlogin.utils.JwtUtil
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.BadCredentialsException
import java.time.temporal.ChronoUnit

class GlobalAuthenticationFilter(
    private val userDetailsService: UserDetailsService
): OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val nonFilteredRequests = mutableListOf(
            AntPathRequestMatcher("/static/{filename}"),
            AntPathRequestMatcher("/api/v1/events/{id}/register"),
            AntPathRequestMatcher("/api/v1/events/{id}"),
            AntPathRequestMatcher("/api/v1/auth/login"),
            AntPathRequestMatcher("/api/v1/login/qr"),
            AntPathRequestMatcher("/api/v1/users/*"),
            AntPathRequestMatcher("/api/v1/users", HttpMethod.POST.name()),
        )

        return nonFilteredRequests.any { it.matches(request) }
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        var accessToken = request.getHeader("Authorization")
        var refreshToken = request.getHeader("Refresh-Token")
        if(accessToken == null || refreshToken == null) {
            throw BadCredentialsException("No authorization")
        }

        var isAccessTokenExpired = false
        var isRefreshTokenExpired = false
        accessToken = accessToken.replace("Bearer ", "")

        var email = ""
        try {
            email = Jwts.parserBuilder()
                .build()
                .parseClaimsJwt(accessToken)
                .body
                .subject
        }catch (e: ExpiredJwtException) {
            isAccessTokenExpired = true
        }

        try {
            Jwts.parserBuilder()
                .build()
                .parseClaimsJwt(refreshToken)
        }catch (e: ExpiredJwtException) {
            isRefreshTokenExpired = true
        }

        if(isAccessTokenExpired || !isRefreshTokenExpired) {
            accessToken = JwtUtil.createToken(email ,15L, ChronoUnit.MINUTES)
            refreshToken = JwtUtil.createToken(email, 7L, ChronoUnit.DAYS)
        }

        if(isRefreshTokenExpired) {
            filterChain.doFilter(request, response)
            return
        }

        val authenticatedUser = userDetailsService.loadUserByUsername(email) as UserToUserDetailsAdapter
        val successfulAuthentication = SuccessfulAuthenticationToken(authenticatedUser)
        successfulAuthentication.isAuthenticated = true

        SecurityContextHolder.getContext().authentication = successfulAuthentication

        response.reset()
        response.status = HttpStatus.NO_CONTENT.value()
        response.setHeader("Authorization", accessToken)
        response.setHeader("Refresh-Token", refreshToken)
        response.addHeader("Access-Control-Expose-Headers", "Authorization, RefreshToken")

        filterChain.doFilter(request, response)
    }

}
