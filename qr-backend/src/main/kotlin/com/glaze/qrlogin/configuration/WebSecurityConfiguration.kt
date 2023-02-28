package com.glaze.qrlogin.configuration

import com.glaze.qrlogin.repositories.QrCodeRepository
import com.glaze.qrlogin.configuration.global.GlobalAuthenticationFilter
import com.glaze.qrlogin.configuration.qr.QrAuthenticationFilter
import com.glaze.qrlogin.configuration.qr.QrAuthenticationProvider
import com.glaze.qrlogin.configuration.shared.RedisUserDetailsService
import com.glaze.qrlogin.configuration.userpass.PasswordAuthenticationFilter
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class WebSecurityConfiguration (
    private val userDetailsService: UserDetailsService,
    private val qrCodeRepository: QrCodeRepository
){

    @Value(value = "\${web.app.origin}")
    private lateinit var origin: String

    @Bean
    fun authenticationManager(): AuthenticationManager {
        val daoAuthenticationProvider = DaoAuthenticationProvider().apply {
            this.setPasswordEncoder(passwordEncoder())
            this.setUserDetailsService(userDetailsService)
        }

        val qrAuthenticationProvider = QrAuthenticationProvider(qrCodeRepository, userDetailsService as RedisUserDetailsService)

        return ProviderManager(daoAuthenticationProvider, qrAuthenticationProvider)
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.cors {
            val configuration = CorsConfiguration()
            configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD")
            configuration.allowCredentials = true
            configuration.maxAge = 60 * 60 * 1000
            configuration.allowedOrigins = listOf(origin)
            configuration.allowedHeaders = listOf("*")

            val source = UrlBasedCorsConfigurationSource()
            source.registerCorsConfiguration("/**", configuration)

            it.configurationSource(source)
        }.csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers(
                    "/api/v1/qrcode", "/api/v1/users/me", "/api/v1/events/*/user-show",
                    "/api/v1/events/*/login-cancel", "/api/v1/events/*/login-perform")
                        .authenticated()
                    .requestMatchers(
                        "/api/v1/auth/login", "/api/v1/login/qr", "/api/v1/events/*/register",
                        "/api/v1/events/{id}")
                        .permitAll()
                    .requestMatchers("/api/v1/users").anonymous()
                    .anyRequest()
                        .authenticated()
            }
            .authenticationManager(this.authenticationManager())
            .addFilter(PasswordAuthenticationFilter(authenticationManager()))
            .addFilterAfter(QrAuthenticationFilter(authenticationManager()), PasswordAuthenticationFilter::class.java)
            .addFilterAfter(
                GlobalAuthenticationFilter(userDetailsService),
                QrAuthenticationFilter::class.java
            )
            .httpBasic { it.disable() }
            .formLogin { it.disable() }

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder(4)
    }

}
