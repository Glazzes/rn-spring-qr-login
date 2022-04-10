package com.glaze.qrlogin.security.qr

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority

class QrAuthenticationToken(authorities: Collection<GrantedAuthority>) : AbstractAuthenticationToken(authorities) {

    override fun getCredentials(): Any {
        TODO("Not yet implemented")
    }

    override fun getPrincipal(): Any {
        TODO("Not yet implemented")
    }
}