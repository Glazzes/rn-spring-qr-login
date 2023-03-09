package com.glaze.qrlogin.service

import com.glaze.qrlogin.entities.User
import com.glaze.qrlogin.dtos.response.UserDTO
import com.glaze.qrlogin.dtos.request.SignUpRequest
import com.glaze.qrlogin.repositories.UserRepository
import com.glaze.qrlogin.utils.FileUtil
import com.glaze.qrlogin.utils.SecurityUtil
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.validation.BindException
import org.springframework.validation.FieldError
import org.springframework.validation.MapBindingResult
import jakarta.validation.Validator
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.multipart.MultipartFile
import kotlin.jvm.Throws

@Service
class UserService(
    private val validator: Validator,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
){

    @Value("\${web.app.image-store}")
    private lateinit var destination: String

    fun save(request: SignUpRequest, picture: MultipartFile): UserDTO {
        validate(request)

        val profilePictureId = FileUtil.save(picture, destination)
        val userEntity = User(
            username = request.username,
            password = passwordEncoder.encode(request.password),
            email = request.email,
            profilePicture = profilePictureId
        )

        val savedUser = userRepository.save(userEntity)
        return UserDTO(savedUser.id, savedUser.username, savedUser.profilePicture)
    }

    fun currentUser(): UserDTO {
        val user = SecurityUtil.getAuthenticatedUser()
        return UserDTO(user.id, user.username, user.profilePicture)
    }

    fun existsByEmail(email: String): Boolean = userRepository.existsByEmail(email)

    @Throws(exceptionClasses =  [BindException::class])
    private fun validate(request: SignUpRequest) {
        val constraints = validator.validate(request)
        if(constraints.isNotEmpty()) {
            val bindingResult = MapBindingResult(mutableMapOf<String, Any>(), "request")
            for(constraint in constraints) {
                var name = ""
                for(node in constraint.propertyPath) {
                    name = node.name
                }

                bindingResult.addError(
                    FieldError("request", name, constraint.message)
                )
            }

            throw BindException(bindingResult)
        }
    }

}
