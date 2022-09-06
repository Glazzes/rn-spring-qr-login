package com.glaze.qrlogin.security

import com.glaze.qrlogin.repositories.QrCodeRepository
import com.glaze.qrlogin.security.global.GlobalAuthenticationFilter
import com.glaze.qrlogin.security.qr.QrAuthenticationFilter
import com.glaze.qrlogin.security.qr.QrAuthenticationProvider
import com.glaze.qrlogin.security.shared.RedisUserDetailsService
import com.glaze.qrlogin.security.userpass.PasswordAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration

@Configuration
class WebSecurityConfig (
    private val userDetailsService: UserDetailsService,
    private val qrCodeRepository: QrCodeRepository
){

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
        http.csrf { it.disable() }
            .cors { it.configurationSource {
                val configuration = CorsConfiguration()
                configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                configuration.allowCredentials = true
                configuration.maxAge = 60 * 60 * 1000
                configuration.allowedOrigins = listOf("http://localhost:19006/")

                configuration
            }}
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeRequests {
                it.antMatchers(
                    "/api/v1/qrcode", "/api/v1/users/me", "/api/v1/events/*/user-show",
                    "/api/v1/events/*/login-cancel", "/api/v1/events/*/login-perform")
                        .authenticated()
                    .antMatchers("/api/v1/auth/login", "/api/v1/login/qr", "/api/v1/events/*/register")
                        .permitAll()
                    .antMatchers("/api/v1/users").anonymous()
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