package com.SimpleNotatnik.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Data
public class AuthConfigDto {
   private String authority;
   private String clientId;
   private String redirectUrl;
   private String logoutUrl;
   private String scope;
   private String responseType;
}
