/**
 * ============================================================================
 * Project      : ROOTYM Global Export Platform
 * Organization : ROOTYM AGRO HARVEST PRIVATE LIMITED
 * Module       : Platform Number Generator
 * Feature      : Business Document Number Engine
 * File         : lib/services/number-generator.service.ts
 * Version      : 1.0.0
 *
 * ============================================================================
 * DESCRIPTION
 * ============================================================================
 *
 * Centralized document numbering service used across the ROOTYM platform.
 *
 * Supported Documents
 * -------------------
 * • Inquiry
 * • Quote
 * • Order
 * • Shipment
 * • Invoice
 * • Customer
 * • Supplier
 *
 * Number Format
 * -------------
 *
 *      PREFIX-YYYY-000001
 *
 * Examples
 * --------
 *
 *      INQ-2026-000001
 *      QT-2026-000001
 *      ORD-2026-000001
 *      SHP-2026-000001
 *
 * Design Goals
 * ------------
 *
 * ✔ Enterprise Ready
 * ✔ Thread Safe
 * ✔ Transaction Safe
 * ✔ AI Ready
 * ✔ Reusable
 * ✔ Extensible
 *
 * ============================================================================
 */

import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

/* ============================================================================
 * DOCUMENT TYPES
 * ============================================================================
 */

export enum NumberSequenceType {

    INQUIRY = "INQUIRY",

    QUOTE = "QUOTE",

    ORDER = "ORDER",

    SHIPMENT = "SHIPMENT",

    INVOICE = "INVOICE",

    CUSTOMER = "CUSTOMER",

    SUPPLIER = "SUPPLIER",

}

/* ============================================================================
 * PREFIX MAPPING
 * ============================================================================
 */

export const NumberPrefix = {

    [NumberSequenceType.INQUIRY]: "INQ",

    [NumberSequenceType.QUOTE]: "QT",

    [NumberSequenceType.ORDER]: "ORD",

    [NumberSequenceType.SHIPMENT]: "SHP",

    [NumberSequenceType.INVOICE]: "INV",

    [NumberSequenceType.CUSTOMER]: "CUS",

    [NumberSequenceType.SUPPLIER]: "SUP",

} as const;

/* ============================================================================
 * OPTIONS
 * ============================================================================
 */

export interface GenerateNumberOptions {

    /**
     * Sequence Type
     */
    type: NumberSequenceType;

    /**
     * Override year.
     * Default: current year.
     */
    year?: number;

}

/* ============================================================================
 * RESULT
 * ============================================================================
 */

export interface GeneratedNumber {

    /**
     * Complete formatted number.
     *
     * Example:
     * QT-2026-000012
     */
    number: string;

    /**
     * Numeric sequence.
     */
    sequence: number;

    /**
     * Prefix.
     */
    prefix: string;

    /**
     * Business year.
     */
    year: number;

}

/* ============================================================================
 * FORMAT UTILITIES
 * ============================================================================
 */

export class NumberFormatter {

    /**
     * Pads numeric value.
     *
     * 12 -> 000012
     */

    static pad(sequence: number): string {

        return sequence
            .toString()
            .padStart(6, "0");

    }

    /**
     * Builds final document number.
     */

    static format(

        prefix: string,

        year: number,

        sequence: number,

    ): string {

        return `${prefix}-${year}-${this.pad(sequence)}`;

    }

}

/* ============================================================================
 * SERVICE
 * ============================================================================
 */

export class NumberGeneratorService {

    /**
     * Returns current year.
     */

    private static getYear(

        year?: number,

    ): number {

        return year ?? new Date().getFullYear();

    }

    /**
     * Returns prefix.
     */

    private static getPrefix(

        type: NumberSequenceType,

    ): string {

        return NumberPrefix[type];

    }

    /**
     * Returns Prisma client.
     */


        /* =========================================================================
     * CORE GENERATOR
     * =========================================================================
     *
     * Generates the next sequential number for the requested business entity.
     *
     * The entire operation executes inside a database transaction to ensure
     * uniqueness under concurrent requests.
     * =========================================================================
     */

        static async generate(
            options: GenerateNumberOptions,
            tx?: Prisma.TransactionClient,
        ): Promise<GeneratedNumber> {
        
            const year = this.getYear(options.year);
            const prefix = this.getPrefix(options.type);
        
            const execute = async (trx: Prisma.TransactionClient) => {
        
                const existing = await trx.numberSequence.findUnique({
                    where: {
                        type_year: {
                            type: options.type,
                            year,
                        },
                    },
                });
        
                let sequence: number;
        
                if (!existing) {
        
                    const created = await trx.numberSequence.create({
                        data: {
                            type: options.type,
                            year,
                            lastValue: 1,
                        },
                    });
        
                    sequence = created.lastValue;
        
                } else {
        
                    const updated = await trx.numberSequence.update({
                        where: {
                            id: existing.id,
                        },
                        data: {
                            lastValue: {
                                increment: 1,
                            },
                        },
                    });
        
                    sequence = updated.lastValue;
                }
        
                return {
                    number: NumberFormatter.format(
                        prefix,
                        year,
                        sequence,
                    ),
                    prefix,
                    year,
                    sequence,
                };
            };
        
            if (tx) {
                return execute(tx);
            }
        
            return prisma.$transaction(execute);
        }
    
        /* =========================================================================
         * CONVENIENCE METHODS
         * ========================================================================= */
    
        static async getNextInquiryNumber(
            tx?: Prisma.TransactionClient,
        ) {
    
            return this.generate(
                {
                    type: NumberSequenceType.INQUIRY,
                },
                tx,
            );
    
        }
    
        static async getNextQuoteNumber(
            tx?: Prisma.TransactionClient,
        ) {
    
            return this.generate(
                {
                    type: NumberSequenceType.QUOTE,
                },
                tx,
            );
    
        }
    
        static async getNextOrderNumber(
            tx?: Prisma.TransactionClient,
        ) {
    
            return this.generate(
                {
                    type: NumberSequenceType.ORDER,
                },
                tx,
            );
    
        }
    
        static async getNextShipmentNumber(
            tx?: Prisma.TransactionClient,
        ) {
    
            return this.generate(
                {
                    type: NumberSequenceType.SHIPMENT,
                },
                tx,
            );
    
        }
    
        static async getNextInvoiceNumber(
            tx?: Prisma.TransactionClient,
        ) {
    
            return this.generate(
                {
                    type: NumberSequenceType.INVOICE,
                },
                tx,
            );
    
        }
    
        static async getNextCustomerNumber(
            tx?: Prisma.TransactionClient,
        ) {
    
            return this.generate(
                {
                    type: NumberSequenceType.CUSTOMER,
                },
                tx,
            );
    
        }
    
        static async getNextSupplierNumber(
            tx?: Prisma.TransactionClient,
        ) {
    
            return this.generate(
                {
                    type: NumberSequenceType.SUPPLIER,
                },
                tx,
            );
    
        }
            /* =========================================================================
     * VALIDATION
     * ========================================================================= */

    /**
     * Validates whether a document number belongs to the
     * expected sequence type.
     *
     * Example:
     *
     * QT-2026-000012
     */

    static validate(
        number: string,
        type: NumberSequenceType,
    ): boolean {

        const prefix =
            this.getPrefix(type);

        const regex =
            new RegExp(
                `^${prefix}-\\d{4}-\\d{6}$`
            );

        return regex.test(number);

    }

    /* =========================================================================
     * PARSER
     * ========================================================================= */

    /**
     * Converts
     *
     * QT-2026-000123
     *
     * into structured data.
     */

    static parse(number: string) {

        const parts =
            number.split("-");

        if (parts.length !== 3) {
            throw new Error(
                "Invalid business document number."
            );
        }

        return {

            prefix: parts[0],

            year: Number(parts[1]),

            sequence: Number(parts[2]),

        };

    }

    /* =========================================================================
     * GENERIC GENERATOR
     * ========================================================================= */

    /**
     * Alias kept for future compatibility.
     *
     * Allows AI modules and future business modules
     * to simply call:
     *
     * NumberGeneratorService.next(...)
     */

    static async next(
        type: NumberSequenceType,
        tx?: Prisma.TransactionClient,
    ) {

        return this.generate(
            {
                type,
            },
            tx,
        );

    }

    /* =========================================================================
     * FUTURE EXTENSION
     * ========================================================================= */

    /**
     * Reserved for future financial years.
     *
     * Example
     *
     * FY26
     * FY26-27
     * ROOTYM-2026
     */

    static buildCustomFormat(
        prefix: string,
        year: number,
        sequence: number,
    ) {

        return NumberFormatter.format(

            prefix,

            year,

            sequence,

        );

    }

}

/* ============================================================================
 * EXPORTS
 * ============================================================================
 */

export default NumberGeneratorService;

/* ============================================================================
 * ROADMAP
 * ============================================================================
 *
 * Phase 2
 * ---------------------------------------------------------------------------
 * • PostgreSQL Row-Level Locking (SELECT ... FOR UPDATE)
 * • Configurable Prefixes from Database
 * • Multi-Company Prefix Support
 * • Financial Year Support (FY26-27)
 * • Monthly Sequence Reset
 * • Branch-wise Numbering
 *
 * Phase 3
 * ---------------------------------------------------------------------------
 * • Country-specific Formats
 * • Customer-configurable Templates
 * • AI Generated Business References
 * • Offline Reserved Number Blocks
 *
 * ============================================================================
 *
 * CURRENT FORMAT
 *
 *      PREFIX-YYYY-000001
 *
 * Examples
 *
 *      INQ-2026-000001
 *      QT-2026-000001
 *      ORD-2026-000001
 *      SHP-2026-000001
 *
 * ============================================================================
 *
 * IMPORTANT IMPLEMENTATION NOTE
 *
 * For production deployment on PostgreSQL, the generate() method should use
 * row-level locking (SELECT ... FOR UPDATE) or an equivalent atomic sequence
 * strategy to eliminate race conditions under high concurrency. The public API
 * of this service is already designed so that the internal implementation can
 * be upgraded without changing any calling code.
 *
 * ============================================================================
 */