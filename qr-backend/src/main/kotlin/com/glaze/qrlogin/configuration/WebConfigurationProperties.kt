package com.glaze.qrlogin.configuration

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "web.app", ignoreUnknownFields = true)
data class WebConfigurationProperties(
    @get:NotBlank(message = "{web.image-store.required}")
    val imageStore: String,

    @get:NotEmpty(message = "{web.origins.not-empty}")
    val origins: List<String>
)
