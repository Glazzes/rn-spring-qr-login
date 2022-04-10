package com.glaze.qrlogin.security.userpass

import com.fasterxml.jackson.databind.ObjectMapper
import com.glaze.qrlogin.objects.LoginRequest
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.stereotype.Component
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class PasswordAuthenticationFilter(
    authenticationManager: AuthenticationManager
): UsernamePasswordAuthenticationFilter(authenticationManager){
    private val objectMapper = ObjectMapper()

    init {
        this.setFilterProcessesUrl("/api/v1/login")
    }

    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse): Authentication {
        val loginRequest = objectMapper.readValue(request.inputStream, LoginRequest::class.java)
        val authentication = UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)

        return this.authenticationManager
            .authenticate(authentication)
    }

    override fun successfulAuthentication(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain,
        authResult: Authentication
    ) {

        chain.doFilter(request, response)
    }
}