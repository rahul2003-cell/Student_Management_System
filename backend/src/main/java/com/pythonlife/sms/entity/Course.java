package com.pythonlife.sms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course name is required")
    @Column(name = "course_name", nullable = false, unique = true, length = 100)
    private String courseName;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "fee_amount")
    private Double feeAmount;

    @Column(name = "description", length = 500)
    private String description;
}
