package com.glaze.qrlogin.security.qr

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter
import org.springframework.stereotype.Component
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class QrAuthenticationFilter : AbstractAuthenticationProcessingFilter("/api/v1/login/qr") {
    private val objectMapper = ObjectMapper()

    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse): Authentication {
        return UsernamePasswordAuthenticationToken("glaze", "password")
    }

    override fun successfulAuthentication(
        request: HttpServletRequest?,
        response: HttpServletResponse?,
        chain: FilterChain?,
        authResult: Authentication?
    ) {
        super.successfulAuthentication(request, response, chain, authResult)
    }
}