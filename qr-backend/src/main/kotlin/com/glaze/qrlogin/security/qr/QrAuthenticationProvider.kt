package com.glaze.qrlogin.security.qr

import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component

@Component
class QrAuthenticationProvider : AuthenticationProvider {

    override fun authenticate(authentication: Authentication): Authentication {
        TODO("Not yet implemented")
    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication == QrAuthenticationToken::class
    }
}