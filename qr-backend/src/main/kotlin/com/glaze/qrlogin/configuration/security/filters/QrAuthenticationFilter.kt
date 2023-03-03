package com.glaze.qrlogin.configuration.security.filters

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.glaze.qrlogin.configuration.security.tokens.QrAuthenticationToken
import com.glaze.qrlogin.configuration.security.contracts.UserToUserDetailsAdapter
import com.glaze.qrlogin.configuration.security.tokens.SuccessfulAuthenticationToken
import com.glaze.qrlogin.dtos.request.QrCodeLoginRequest
import com.glaze.qrlogin.utils.JwtUtil
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import java.time.temporal.ChronoUnit

class QrAuthenticationFilter(
    authenticationManager: AuthenticationManager
): AbstractAuthenticationProcessingFilter(AntPathRequestMatcher("/api/v1/login/qr", HttpMethod.POST.name())) {
    private val objectMapper = jacksonObjectMapper()

    init {
        this.authenticationManager = authenticationManager
    }

    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse): Authentication {
        val qrCodeRequest = objectMapper.readValue(request.inputStream, QrCodeLoginRequest::class.java)

        return this.authenticationManager
            .authenticate(QrAuthenticationToken(qrCodeRequest))
    }

    override fun successfulAuthentication(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain,
        authResult: Authentication
    ) {
        val principal = authResult.principal as UserToUserDetailsAdapter
        val accessToken = JwtUtil.createToken(principal.user.email, 15L, ChronoUnit.MINUTES)
        val refreshToken = JwtUtil.createToken(principal.user.email, 7L, ChronoUnit.DAYS)

        val successfulAuthenticationToken = SuccessfulAuthenticationToken(principal)
        successfulAuthenticationToken.isAuthenticated = true

        SecurityContextHolder.getContext().authentication = successfulAuthenticationToken

        response.status = HttpStatus.NO_CONTENT.value()
        response.addHeader("Authorization", "Bearer $accessToken")
        response.addHeader("Refresh-Token", refreshToken)
        response.addHeader("Access-Control-Expose-Headers", "Authorization, RefreshToken")

        chain.doFilter(request, response)
    }
}
