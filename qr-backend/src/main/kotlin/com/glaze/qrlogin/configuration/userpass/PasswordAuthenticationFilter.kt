package com.glaze.qrlogin.configuration.userpass

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.glaze.qrlogin.dtos.request.LoginRequest
import com.glaze.qrlogin.configuration.shared.SuccessfulAuthenticationToken
import com.glaze.qrlogin.configuration.shared.UserToUserDetailsAdapter
import com.glaze.qrlogin.utils.JwtUtil
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

class PasswordAuthenticationFilter(
    authenticationManager: AuthenticationManager
): UsernamePasswordAuthenticationFilter(authenticationManager){
    private val objectMapper = jacksonObjectMapper()

    init {
        this.setFilterProcessesUrl("/api/v1/auth/login")
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
        val authenticatedUser = authResult.principal as UserToUserDetailsAdapter
        val successfulAuthenticationToken = SuccessfulAuthenticationToken(authenticatedUser)
        successfulAuthenticationToken.isAuthenticated = true

        SecurityContextHolder.getContext().authentication = successfulAuthenticationToken

        val token = JwtUtil.createToken(authResult.name)
        response.addHeader("Authorization", "Bearer $token")
        chain.doFilter(request, response)
    }
}
