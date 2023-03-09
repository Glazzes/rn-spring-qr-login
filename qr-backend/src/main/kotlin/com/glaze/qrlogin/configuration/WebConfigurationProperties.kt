package com.glaze.qrlogin.configuration

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "web.app", ignoreUnknownFields = true)
data class WebConfigurationProperties(
    @NotBlank(message = "{web.image-store.required}")
    val imageStore: String,

    @NotEmpty(message = "{web.origins.required}")
    val origins: List<String>
)
