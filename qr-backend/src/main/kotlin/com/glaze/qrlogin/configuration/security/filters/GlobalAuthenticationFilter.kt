package com.glaze.qrlogin.configuration.security.filters

import com.glaze.qrlogin.configuration.security.tokens.SuccessfulAuthenticationToken
import com.glaze.qrlogin.configuration.security.contracts.UserToUserDetailsAdapter
import com.glaze.qrlogin.utils.JwtUtil
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

class GlobalAuthenticationFilter(
    private val userDetailsService: UserDetailsService
): OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val nonFilteredRequests = mutableListOf(
            AntPathRequestMatcher("/static/{filename}"),
            AntPathRequestMatcher("/api/v1/events/{id}/register"),
            AntPathRequestMatcher("/api/v1/events/{id}"),
            AntPathRequestMatcher("/api/v1/auth/*"),
            AntPathRequestMatcher("/api/v1/users/exists"),
            AntPathRequestMatcher("/api/v1/users/validate"),
            AntPathRequestMatcher("/api/v1/logout"),
            AntPathRequestMatcher("/api/v1/users", HttpMethod.POST.name()),
        )

        return nonFilteredRequests.any { it.matches(request) }
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = request.getHeader("Authorization") ?:
           throw BadCredentialsException("No Authorization header present in request")

        val accessToken = token.replace("Bearer ", "")

        val email: String
        try {
            email = JwtUtil.getSubjectFromToken(accessToken)
        }catch (e: Exception) {
            filterChain.doFilter(request, response)
            return
        }

        val authenticatedUser = userDetailsService.loadUserByUsername(email) as UserToUserDetailsAdapter
        val successfulAuthentication = SuccessfulAuthenticationToken(authenticatedUser)
        successfulAuthentication.isAuthenticated = true

        SecurityContextHolder.getContext().authentication = successfulAuthentication

        response.status = HttpStatus.NO_CONTENT.value()

        filterChain.doFilter(request, response)
    }

}
