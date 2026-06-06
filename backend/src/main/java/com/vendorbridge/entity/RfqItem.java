package com.vendorbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "rfq_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfqItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfq_id", nullable = false)
    private Rfq rfq;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    /**
     * Unit of measure, e.g., pcs, kg, boxes.
     */
    @Column(length = 50)
    private String unit;

    @Column(name = "estimated_price", precision = 15, scale = 2)
    private BigDecimal estimatedPrice;
}
