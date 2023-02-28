package com.glaze.qrlogin.configuration.global

import com.glaze.qrlogin.configuration.shared.SuccessfulAuthenticationToken
import com.glaze.qrlogin.configuration.shared.UserToUserDetailsAdapter
import io.jsonwebtoken.Jwts
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse

class GlobalAuthenticationFilter(
    private val userDetailsService: UserDetailsService
): OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val nonFilteredRequests = mutableListOf(
            AntPathRequestMatcher("/api/v1/events/{id}/register"),
            AntPathRequestMatcher("/api/v1/events/{id}"),
            AntPathRequestMatcher("/api/v1/auth/login"),
            AntPathRequestMatcher("/api/v1/users"),
            AntPathRequestMatcher("/api/v1/login/qr")
        )

        return nonFilteredRequests.any { it.matches(request) }
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = request.getHeader("Authorization")
            .replace("Bearer ", "")

        val username = Jwts.parserBuilder()
            .build()
            .parseClaimsJwt(token)
            .body
            .subject

        val authenticatedUser = userDetailsService.loadUserByUsername(username) as UserToUserDetailsAdapter
        val successfulAuthentication = SuccessfulAuthenticationToken(authenticatedUser)
        successfulAuthentication.isAuthenticated = true

        SecurityContextHolder.getContext().authentication = successfulAuthentication
        response.status = HttpStatus.NO_CONTENT.value()

        filterChain.doFilter(request, response)
    }

}
