package com.glaze.qrlogin.configuration.security.filters

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.glaze.qrlogin.dtos.request.LoginRequest
import com.glaze.qrlogin.configuration.security.tokens.SuccessfulAuthenticationToken
import com.glaze.qrlogin.configuration.security.contracts.UserToUserDetailsAdapter
import com.glaze.qrlogin.utils.JwtUtil
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import java.time.temporal.ChronoUnit

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
        val principal = authResult.principal as UserToUserDetailsAdapter
        val successfulAuthenticationToken = SuccessfulAuthenticationToken(principal)
        successfulAuthenticationToken.isAuthenticated = true

        SecurityContextHolder.getContext().authentication = successfulAuthenticationToken

        val accessToken = JwtUtil.createToken(principal.user.email, 15L, ChronoUnit.MINUTES)
        val refreshToken = JwtUtil.createToken(principal.user.email, 7L, ChronoUnit.DAYS)

        response.status = HttpStatus.NO_CONTENT.value()
        response.addHeader("Authorization", "Bearer $accessToken")
        response.addHeader("Refresh-Token", refreshToken)
        response.addHeader("Access-Control-Expose-Headers", "Authorization, RefreshToken")

        chain.doFilter(request, response)
    }
}
