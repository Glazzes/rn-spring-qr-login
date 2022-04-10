package com.glaze.qrlogin.security.global

import org.springframework.http.HttpMethod
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.stereotype.Component
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
        TODO("Not yet implemented")
    }

}