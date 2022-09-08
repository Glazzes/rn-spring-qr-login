package com.glaze.qrlogin.security.qr

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.glaze.qrlogin.objects.QrCodeLoginRequest
import com.glaze.qrlogin.utils.JwtUtil
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class QrAuthenticationFilter(
    authenticationManager: AuthenticationManager
): AbstractAuthenticationProcessingFilter(AntPathRequestMatcher("/api/v1/login/qr", HttpMethod.POST.name)) {
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
