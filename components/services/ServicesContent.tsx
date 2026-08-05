"use client";

import Link from "next/link";

import {
    ArrowRight,
    BadgeCheck,
    ClipboardCheck,
    FileCheck2,
    Globe2,
    Package,
    ShieldCheck,
    Ship,
    Sparkles,
    Truck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { useTranslation } from "@/lib/i18n/context";
export default function ServicesContent() {
    const { t } = useTranslation();
    return (
        <main className="overflow-x-hidden bg-white">
            {/* -------------------------------------------------------------------------- */}
            {/* Hero */}
            {/* -------------------------------------------------------------------------- */}

            <section className="relative overflow-hidden border-b border-green-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#DCFCE7,transparent_40%),radial-gradient(circle_at_bottom_left,#ECFDF5,transparent_40%)]" />

                <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-5 py-2 text-sm font-semibold text-[#2E7D32] shadow-sm backdrop-blur">
                        <Sparkles className="h-4 w-4" />
                        {t("services.hero.badge")}
                    </div>

                    <h1 className="mt-8 max-w-5xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-7xl">
                        {t("services.hero.title.line1")}
                        <span className="block bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
                            {t("services.hero.title.line2")}
                        </span>
                    </h1>

                    <p className="mt-8 max-w-3xl text-xl leading-9 text-gray-600">
                        {t("services.hero.description")}
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <Link href="/request-quote">
                            <Button className="px-8 py-3">
                                {t("services.hero.buttons.quote")}
                            </Button>
                        </Link>

                        <Link href="#services">
                            <Button variant="secondary" className="px-8 py-3">
                                {t("services.hero.buttons.explore")}
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-16 grid w-full max-w-5xl gap-5 md:grid-cols-4">
                        <HighlightCard
                            icon={<ShieldCheck className="h-6 w-6" />}
                            title={t("services.hero.highlights.quality.title")}
                            subtitle={t("services.hero.highlights.quality.subtitle")}
                        />

                        <HighlightCard
                            icon={<FileCheck2 className="h-6 w-6" />}
                            title={t("services.hero.highlights.compliance.title")}
                            subtitle={t("services.hero.highlights.compliance.subtitle")}
                        />

                        <HighlightCard
                            icon={<Truck className="h-6 w-6" />}
                            title={t("services.hero.highlights.logistics.title")}
                            subtitle={t("services.hero.highlights.logistics.subtitle")}
                        />

                        <HighlightCard
                            icon={<Globe2 className="h-6 w-6" />}
                            title={t("services.hero.highlights.trade.title")}
                            subtitle={t("services.hero.highlights.trade.subtitle")}
                        />
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------------------------- */}
            {/* Core Services */}
            {/* -------------------------------------------------------------------------- */}

            <section
                id="services"
                className="mx-auto max-w-7xl px-6 py-24"
            >
                <div className="max-w-3xl">
                    <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
                        {t("services.core.badge")}
                    </span>

                    <h2 className="mt-4 text-4xl font-bold text-gray-900">
                        {t("services.core.title")}
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        {t("services.core.description")}
                    </p>
                </div>

                <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    <ServiceCard
                        icon={<Package className="h-7 w-7" />}
                        title={t("services.core.cards.sourcing.title")}
                        description={t("services.core.cards.sourcing.description")}
                    />

                    <ServiceCard
                        icon={<ClipboardCheck className="h-7 w-7" />}
                        title={t("services.core.cards.inspection.title")}
                        description={t("services.core.cards.inspection.description")}
                    />

                    <ServiceCard
                        icon={<BadgeCheck className="h-7 w-7" />}
                        title={t("services.core.cards.documentation.title")}
                        description={t("services.core.cards.documentation.description")}
                    />

                    <ServiceCard
                        icon={<Package className="h-7 w-7" />}
                        title={t("services.core.cards.packaging.title")}
                        description={t("services.core.cards.packaging.description")}
                    />

                    <ServiceCard
                        icon={<Ship className="h-7 w-7" />}
                        title={t("services.core.cards.freight.title")}
                        description={t("services.core.cards.freight.description")}
                    />

                    <ServiceCard
                        icon={<Globe2 className="h-7 w-7" />}
                        title={t("services.core.cards.buyerSupport.title")}
                        description={t("services.core.cards.buyerSupport.description")}
                    />
                </div>
            </section>
            {/* -------------------------------------------------------------------------- */}
            {/* Export Workflow */}
            {/* -------------------------------------------------------------------------- */}

            <section className="bg-[#F8FBF8] py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
                            {t("services.workflow.badge")}
                        </span>

                        <h2 className="mt-4 text-4xl font-bold text-gray-900">
                            {t("services.workflow.title")}
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            {t("services.workflow.description")}
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-3 xl:grid-cols-6">
                        <WorkflowStep
                            number="01"
                            title={t("services.workflow.steps.step1.title")}
                            description={t("services.workflow.steps.step1.description")}
                        />

                        <WorkflowStep
                            number="02"
                            title={t("services.workflow.steps.step2.title")}

                            description={t("services.workflow.steps.step2.description")}
                        />

                        <WorkflowStep
                            number="03"
                            title={t("services.workflow.steps.step3.title")}

                            description={t("services.workflow.steps.step3.description")}
                        />

                        <WorkflowStep
                            number="04"
                            title={t("services.workflow.steps.step4.title")}

                            description={t("services.workflow.steps.step4.description")}
                        />

                        <WorkflowStep
                            number="05"
                            title={t("services.workflow.steps.step5.title")}

                            description={t("services.workflow.steps.step5.description")}
                        />

                        <WorkflowStep
                            number="06"
                            title={t("services.workflow.steps.step6.title")}

                            description={t("services.workflow.steps.step6.description")}
                        />
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------------------------- */}
            {/* Why ROOTYM */}
            {/* -------------------------------------------------------------------------- */}

            <section className="mx-auto max-w-7xl px-6 py-24">
                <div className="text-center">
                    <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
                        {t("services.why.badge")}
                    </span>

                    <h2 className="mt-4 text-4xl font-bold text-gray-900">
                        {t("services.why.title")}
                    </h2>

                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                        {t("services.why.description")}
                    </p>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-2">
                    <WhyCard
                        title={t("services.why.cards.communication.title")}

                        description={t("services.why.cards.communication.description")}
                    />

                    <WhyCard
                        title={t("services.why.cards.compliance.title")}

                        description={t("services.why.cards.compliance.description")}
                    />

                    <WhyCard
                        title={t("services.why.cards.quality.title")}

                        description={t("services.why.cards.quality.description")}
                    />

                    <WhyCard
                        title={t("services.why.cards.execution.title")}

                        description={t("services.why.cards.execution.description")}
                    />

                    <WhyCard
                        title={t("services.why.cards.buyer.title")}

                        description={t("services.why.cards.buyer.description")}
                    />

                    <WhyCard
                        title={t("services.why.cards.partnership.title")}

                        description={t("services.why.cards.partnership.description")}

                    />
                </div>
            </section>
            {/* -------------------------------------------------------------------------- */}
            {/* ROOTYM Brain */}
            {/* -------------------------------------------------------------------------- */}

            <section className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mx-auto max-w-5xl text-center text-white">
                        <div className="inline-flex items-center gap-2 rounded-full border border-green-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur">
                            <Sparkles className="h-4 w-4 text-green-300" />
                            {t("services.ai.badge")}
                        </div>

                        <h2 className="mt-8 text-4xl font-bold md:text-6xl">
                            {t("services.ai.title.line1")}
                            <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
                                {t("services.ai.title.line2")}
                            </span>
                        </h2>

                        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100">
                            {t("services.ai.description")}
                        </p>

<div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
 <AIServiceCard
title={t("services.ai.cards.matching.title")}
 description={t("services.ai.cards.matching.description")}
/>

<AIServiceCard
title={t("services.ai.cards.insights.title")}
description={t("services.ai.cards.insights.description")}
/>

                            <AIServiceCard
                                title={t("services.ai.cards.planning.title")}

                                description={t("services.ai.cards.planning.description")}
                            />

                            <AIServiceCard
                                title={t("services.ai.cards.support.title")}

                                description={t("services.ai.cards.support.description")}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------------------------- */}
            {/* Call To Action */}
            {/* -------------------------------------------------------------------------- */}

            <section className="mx-auto max-w-7xl px-6 py-24">
                <div className="rounded-3xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-8 py-14 text-center shadow-2xl md:px-16">
                    <h2 className="text-4xl font-bold text-white md:text-5xl">
                        {t("services.cta.title")}
                    </h2>

                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
                        {t("services.cta.description")}
                    </p>

                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/request-quote">
                            <Button className="bg-white px-8 py-3 text-[#2E7D32] hover:bg-green-50">
                                {t("services.cta.buttons.quote")}
                            </Button>
                        </Link>

                        <Link href="/contact">
                            <Button
                                variant="secondary"
                                className="border-white bg-transparent px-8 py-3 text-white hover:bg-white/10"
                            >
                                {t("services.cta.buttons.contact")}
                            </Button>
                        </Link>
                    </div>
                </div>

            </section>
        </main>
    );

}

/* -------------------------------------------------------------------------- */
/* Helper Components */
/* -------------------------------------------------------------------------- */

function HighlightCard({
    icon,
    title,
    subtitle,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <div className="flex justify-center text-[#2E7D32]">
                {icon}
            </div>

            <h3 className="mt-4 text-center font-bold text-gray-900">
                {title}
            </h3>

            <p className="mt-2 text-center text-sm text-gray-600">
                {subtitle}
            </p>
        </div>
    );
}

function ServiceCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="inline-flex rounded-2xl bg-green-100 p-4 text-[#2E7D32]">
                {icon}
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900">
                {title}
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
                {description}
            </p>
        </div>
    );
}

function WorkflowStep({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-[#2E7D32]">
                {number}
            </div>

            <h3 className="mt-5 font-bold text-gray-900">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
                {description}
            </p>
        </div>
    );
}

function WhyCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900">
                {title}
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
                {description}
            </p>
        </div>
    );
}

function AIServiceCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white">
                {title}
            </h3>

            <p className="mt-4 leading-7 text-green-100">
                {description}
            </p>
        </div>
    );
}
