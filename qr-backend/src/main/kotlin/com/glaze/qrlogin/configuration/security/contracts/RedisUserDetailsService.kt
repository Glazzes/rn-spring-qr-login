package com.glaze.qrlogin.configuration.security.contracts

import com.glaze.qrlogin.repositories.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component

@Component
class RedisUserDetailsService(
    private val userRepository: UserRepository
): UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails {
        val user = userRepository.findByEmail(email) ?:
            throw UsernameNotFoundException("Could not find user with email $email")

        return UserToUserDetailsAdapter(user)
    }

    fun loadUserById(id: String): UserDetails {
        val user = userRepository.findById(id)
            .orElseThrow { UsernameNotFoundException("Could not find user with id $id") }

        return UserToUserDetailsAdapter(user)
    }
}
