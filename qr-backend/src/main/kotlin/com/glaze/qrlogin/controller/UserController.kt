package com.glaze.qrlogin.controller

import com.glaze.qrlogin.dtos.response.UserDTO
import com.glaze.qrlogin.dtos.request.SignUpRequest
import com.glaze.qrlogin.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api/v1/users")
class UserController(private val userService: UserService){

    @PostMapping
    fun save(@Valid @RequestBody request: SignUpRequest) : ResponseEntity<UserDTO> {
        val dto = userService.save(request)
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
                .body(userService.existsByEmail(email))
    }

}
