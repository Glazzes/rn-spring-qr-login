package com.glaze.qrlogin.security.global

import io.jsonwebtoken.Jwts
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class GlobalAuthenticationFilter : OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val notFilteredRequests = mutableListOf(
            AntPathRequestMatcher("/api/v1/emitter/*/register", HttpMethod.POST.name),
            AntPathRequestMatcher("/api/v1/users", HttpMethod.POST.name)
        )

        return notFilteredRequests.any { it.matches(request) }
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = request.getHeader("Token")
            .replace("Bearer ", "")

        val claims = Jwts.parserBuilder()
            .build()
            .parseClaimsJwt(token)

        response.status = HttpStatus.NO_CONTENT.value()
        filterChain.doFilter(request, response)
    }

}