package com.glaze.qrlogin.controller

import com.glaze.qrlogin.entities.dto.UserDTO
import com.glaze.qrlogin.objects.CreateUserRequest
import com.glaze.qrlogin.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/users")
class UserController(private val userService: UserService){

    @PostMapping
    fun save(@RequestBody request: CreateUserRequest) : ResponseEntity<UserDTO> {
        val dto = userService.save(request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(dto)
    }

    @GetMapping(path = ["/me"])
    fun currentUser(): ResponseEntity<UserDTO> {
        return ResponseEntity.status(HttpStatus.OK)
            .body(userService.currentUser())
    }

}