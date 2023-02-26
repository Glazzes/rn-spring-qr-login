package com.glaze.qrlogin.entities

import org.springframework.data.annotation.Id
import org.springframework.data.redis.core.RedisHash
import org.springframework.data.redis.core.index.Indexed

@RedisHash(value = "users")
class User(
    @Id var id: String? = null,
    @Indexed var username: String,
    @Indexed val email: String,
    var password: String,
    var profilePicture: String
)
