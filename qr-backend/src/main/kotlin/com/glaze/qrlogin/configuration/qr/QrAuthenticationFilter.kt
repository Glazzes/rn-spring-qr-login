package com.glaze.qrlogin.configuration.qr

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
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
        val token = JwtUtil.createToken(authResult.name)
        response.status = HttpStatus.NO_CONTENT.value()
        response.addHeader("Authorization", "Bearer $token")
        response.addHeader("Access-Control-Expose-Headers", "Authorization")
        chain.doFilter(request, response)
    }
}
