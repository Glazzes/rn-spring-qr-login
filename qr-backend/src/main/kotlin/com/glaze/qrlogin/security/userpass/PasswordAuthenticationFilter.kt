package com.glaze.qrlogin.security.userpass

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.glaze.qrlogin.objects.LoginRequest
import com.glaze.qrlogin.security.shared.SuccessfulAuthenticationToken
import com.glaze.qrlogin.security.shared.UserToUserDetailsAdapter
import com.glaze.qrlogin.utils.JwtUtil
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

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