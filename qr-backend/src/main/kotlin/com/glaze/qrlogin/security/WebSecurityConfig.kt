package com.glaze.qrlogin.security

import com.glaze.qrlogin.security.global.GlobalAuthenticationFilter
import com.glaze.qrlogin.security.shared.RedisUserDetailsService
import com.glaze.qrlogin.security.qr.QrAuthenticationFilter
import com.glaze.qrlogin.security.qr.QrAuthenticationProvider
import com.glaze.qrlogin.security.userpass.PasswordAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.cors.CorsConfiguration

@EnableWebSecurity
class WebSecurityConfig(
    private val userDetailsService: RedisUserDetailsService,
    private val qrAuthenticationProvider: QrAuthenticationProvider,
): WebSecurityConfigurerAdapter(){

    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder())
            .and()
            .authenticationProvider(qrAuthenticationProvider)
    }

    override fun configure(http: HttpSecurity) {
        http.csrf { it.disable() }
            .cors { it.configurationSource {
                val configuration = CorsConfiguration()
                configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                configuration.allowCredentials = true
                configuration.maxAge = 60 * 60 * 1000
                configuration.allowedOrigins = listOf("http://localhost:19006")

                configuration
            }}
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeRequests {
                it.antMatchers(
                    "/api/v1/qrcode", "/api/v1/users/me", "/api/v1/events/*/user-show",
                    "/api/v1/events/*/login-cancel", "/api/v1/events/*/login-perform").authenticated()
                    .antMatchers("/api/v1/login").permitAll()
                    // .antMatchers("/api/v1/users", "/api/v1/login/qr").anonymous()
                    .anyRequest().denyAll()
            }
            .addFilter(PasswordAuthenticationFilter(this.authenticationManagerBean()))
            .addFilterAfter(
                QrAuthenticationFilter(this.authenticationManagerBean()),
                PasswordAuthenticationFilter::class.java
            )
            .addFilterAfter(
                GlobalAuthenticationFilter(),
                QrAuthenticationFilter::class.java
            )
            .httpBasic { it.disable() }
            .formLogin { it.disable() }
    }

    @Bean
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder(4)
    }

}