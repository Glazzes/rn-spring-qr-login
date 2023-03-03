package com.glaze.qrlogin.configuration.security.tokens

import com.glaze.qrlogin.configuration.security.contracts.UserToUserDetailsAdapter
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

class SuccessfulAuthenticationToken(
    private val principal: UserToUserDetailsAdapter,
    authorities: Collection<GrantedAuthority> = listOf(SimpleGrantedAuthority("USER"))
) : AbstractAuthenticationToken(authorities) {
    override fun getCredentials(): Any? {
        return null
    }

    override fun getPrincipal(): Any {
        return this.principal
    }
}
