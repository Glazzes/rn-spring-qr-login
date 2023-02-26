package com.glaze.qrlogin.repositories

import com.glaze.qrlogin.entities.User
import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, String> {
    fun findByUsername(username: String): User?
    fun existsByEmail(email: String): Boolean
}
