package com.glaze.qrlogin.utils

import com.glaze.qrlogin.entities.User
import com.glaze.qrlogin.configuration.shared.UserToUserDetailsAdapter
import org.springframework.security.core.context.SecurityContextHolder

object SecurityUtil {

    fun getAuthenticatedUser(): User {
        val adapter = SecurityContextHolder.getContext()
            .authentication
            .principal as UserToUserDetailsAdapter

        return adapter.user
    }

}
