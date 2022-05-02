package com.glaze.qrlogin.security.shared

import com.glaze.qrlogin.repositories.UserRepository
import com.glaze.qrlogin.security.shared.UserToUserDetailsAdapter
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component

@Component
class RedisUserDetailsService(
    private val userRepository: UserRepository
): UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username) ?:
            throw UsernameNotFoundException("Could not find user with username $username")

        return UserToUserDetailsAdapter(user)
    }
}