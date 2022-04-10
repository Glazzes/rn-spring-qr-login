package com.glaze.qrlogin.service

import com.glaze.qrlogin.entities.User
import com.glaze.qrlogin.entities.dto.UserDTO
import com.glaze.qrlogin.objects.CreateUserRequest
import com.glaze.qrlogin.repositories.UserRepository
import com.glaze.qrlogin.utils.SecurityUtil
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.GetMapping

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
){

    private val defaultPic = "https://randomuser.me/api/portraits/men/15.jpg"

    fun save(request: CreateUserRequest): UserDTO {
        val userEntity = User(
            username = request.username,
            password = passwordEncoder.encode(request.password),
            email = request.email,
            profilePicture = defaultPic)

        val savedUser = userRepository.save(userEntity)
        return UserDTO(savedUser.username, savedUser.profilePicture)
    }

    fun currentUser(): UserDTO {
        val user = SecurityUtil.getAuthenticatedUser()
        return UserDTO(user.username, user.profilePicture)
    }

}