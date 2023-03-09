package com.glaze.qrlogin.controller

import com.glaze.qrlogin.dtos.response.UserDTO
import com.glaze.qrlogin.dtos.request.SignUpRequest
import com.glaze.qrlogin.service.UserService
import jakarta.validation.Valid
import org.springframework.http.CacheControl
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("/api/v1/users")
class UserController(private val userService: UserService) {

    @PostMapping("/validate")
    fun validate(@Valid @RequestBody request: SignUpRequest): ResponseEntity<Unit> {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

    @PostMapping
    fun save(
        @RequestParam(value = "file") picture: MultipartFile,
        @RequestParam(value = "request") request: SignUpRequest
    ) : ResponseEntity<UserDTO> {
        val dto = userService.save(request, picture)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(dto)
    }

    @GetMapping("/me")
    fun currentUser(): ResponseEntity<UserDTO> {
        return ResponseEntity.status(HttpStatus.OK)
            .body(userService.currentUser())
    }

    @GetMapping("/exists")
    fun exists(@RequestParam email: String): ResponseEntity<Boolean> {
        return ResponseEntity.status(HttpStatus.OK)
            .cacheControl(CacheControl.maxAge(1L, TimeUnit.MINUTES))
            .body(userService.existsByEmail(email))
    }

}
