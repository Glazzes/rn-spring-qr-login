package com.glaze.qrlogin.security.qr

import com.glaze.qrlogin.dtos.request.QrCodeLoginRequest
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

class QrAuthenticationToken(
        private val request: QrCodeLoginRequest,
        authorities: Collection<GrantedAuthority> = mutableListOf(SimpleGrantedAuthority("USER"))
) : AbstractAuthenticationToken(authorities) {

    override fun getCredentials(): Any? {
        return null
    }

    override fun getPrincipal(): Any {
        return this.request
    }
}
