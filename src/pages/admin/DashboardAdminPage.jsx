// src/pages/admin/DashboardAdminPage.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LayoutAdmin from "./LayoutAdmin";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { motion } from "framer-motion";
import DateRangeFilter from "@/components/admin/dashboard/DateRangeFilter";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import UserDemographicsChart from "@/components/admin/dashboard/UserDemographicsChart";
import ProductCategoryChart from "@/components/admin/dashboard/ProductCategoryChart";
import InventoryStatsCard from "@/components/admin/dashboard/InventoryStatsCard";
import BestSellerTable from "@/components/admin/dashboard/BestSellerTable";
import PaymentMethodChart from "@/components/admin/dashboard/PaymentMethodChart";
import RoleStatsChart from "@/components/admin/dashboard/RoleStatsChart";
import ActiveRetentionChart from "@/components/admin/dashboard/ActiveRetentionChart";
// import TopAttributesChart from "@/components/admin/dashboard/TopAttributesChart";
import ProductImagesStatsChart from "@/components/admin/dashboard/ProductImagesStatsChart";
import AverageCartStatsCard from "@/components/admin/dashboard/AverageCartStatsCard";
import ConversionRateCard from "@/components/admin/dashboard/ConversionRateCard";
import OrdersByRegionChart from "@/components/admin/dashboard/OrdersByRegionChart";
import RatingStatsChart from "@/components/admin/dashboard/RatingStatsChart";
import {
    getUsersByRole,
    getDemographics,
    getActiveRetention,
    getProductsByCategory,
    getInventoryStats,
    getRevenueByTime,
    getBestSellingVariants,
    getPaymentByMethod,
    getConversionRate,
    getOrdersByRegion,
    getRatingStats,
    getAverageCartStats,
    // getProductImagesStats,
    // getTopAttributes,
} from "@/apis/stats";

const DashboardAdminPage = () => {
    const [statsData, setStatsData] = useState({
        usersByRole: null,
        demographics: null,
        activeRetention: null,
        productsByCategory: null,
        inventoryStats: null,
        revenueByTime: null,
        bestSellingVariants: null,
        paymentByMethod: null,
        conversionRate: null,
        ordersByRegion: null,
        ratingStats: null,
        averageCartStats: null,
        productImagesStats: null,
        topAttributes: null,
    });
    const [loading, setLoading] = useState(true);
    const toUTC7 = (date) => new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString();

    const [dateRange, setDateRange] = useState({
        fromDate: toUTC7(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        toDate: toUTC7(new Date()),
    });

    const fetchAllStats = async () => {
        setLoading(true);
        try {
            const [
                usersByRoleRes,
                demographicsRes,
                activeRetentionRes,
                productsByCategoryRes,
                inventoryRes,
                revenueByTimeRes,
                bestSellingRes,
                paymentByMethodRes,
                conversionRateRes,
                ordersByRegionRes,
                ratingStatsRes,
                averageCartRes,
                productImagesRes,
                topAttributesRes,
            ] = await Promise.all([
                getUsersByRole(dateRange.fromDate, dateRange.toDate),
                getDemographics(dateRange.fromDate, dateRange.toDate, 5),
                getActiveRetention(dateRange.fromDate, dateRange.toDate),
                getProductsByCategory(dateRange.fromDate, dateRange.toDate),
                getInventoryStats(dateRange.fromDate, dateRange.toDate, 10),
                getRevenueByTime(dateRange.fromDate, dateRange.toDate, "DELIVERED"),
                getBestSellingVariants(dateRange.fromDate, dateRange.toDate, "DELIVERED", 5),
                getPaymentByMethod(dateRange.fromDate, dateRange.toDate),
                getConversionRate(dateRange.fromDate, dateRange.toDate, "DELIVERED", false),
                getOrdersByRegion(dateRange.fromDate, dateRange.toDate, "DELIVERED", "CITY"),
                getRatingStats(dateRange.fromDate, dateRange.toDate, "product"),
                getAverageCartStats(dateRange.fromDate, dateRange.toDate, 5),
                // getProductImagesStats(dateRange.fromDate, dateRange.toDate, false),
                // getTopAttributes(dateRange.fromDate, dateRange.toDate, 5),
            ]);

            setStatsData({
                usersByRole: usersByRoleRes.data,
                demographics: demographicsRes.data,
                activeRetention: activeRetentionRes.data,
                productsByCategory: productsByCategoryRes.data,
                inventoryStats: inventoryRes.data,
                revenueByTime: revenueByTimeRes.data,
                bestSellingVariants: bestSellingRes.data,
                paymentByMethod: paymentByMethodRes.data,
                conversionRate: conversionRateRes.data,
                ordersByRegion: ordersByRegionRes.data,
                ratingStats: ratingStatsRes.data,
                averageCartStats: averageCartRes.data,
                // productImagesStats: productImagesRes.data,
                // topAttributes: topAttributesRes.data,
            });
        } catch (err) {
            toast.error(`Lỗi khi tải dữ liệu dashboard: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllStats();
    }, [dateRange]);

    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    if (loading) {
        return (
            <LayoutAdmin>
                <div className="flex-1 overflow-auto relative z-10">
                    <HeaderAdmin title={"Dashboard"} />
                    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                        <div className="flex justify-center items-center h-64">
                            <div className="text-lg text-gray-500">Đang tải dữ liệu...</div>
                        </div>
                    </main>
                </div>
            </LayoutAdmin>
        );
    }

    return (
        <LayoutAdmin>
            <div className="flex-1 overflow-auto relative z-10">
                <HeaderAdmin title={"Dashboard"} />
                <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* FILTER - Luôn top */}
                        <DateRangeFilter
                            dateRange={dateRange}
                            onDateRangeChange={handleDateRangeChange}
                            onRefresh={fetchAllStats}
                        />

                        {/* SECTION 1: OVERVIEW - StatsCards RIÊNG full-width (không chen grid khác) */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tổng quan</h2>
                            <div className="w-full">  {/* FIX: Force full width cho StatsCards */}
                                <StatsCards statsData={statsData} />
                            </div>
                        </section>

                        {/* SECTION 2: FINANCIAL CARDS - Inventory & AverageCart (2 col riêng, không chen StatsCards) */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kho hàng & Giỏ hàng</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">  {/* 2 col cân bằng */}
                                <InventoryStatsCard inventoryStats={statsData.inventoryStats} />
                                <AverageCartStatsCard averageCartStats={statsData.averageCartStats} />
                            </div>
                        </section>

                        {/* SECTION 3: FINANCIAL CHARTS - Revenue & Conversion (2 col) */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tài chính & Chuyển đổi</h2>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <RevenueChart revenueByTime={statsData.revenueByTime} />
                                <ConversionRateCard conversionRate={statsData.conversionRate} />
                            </div>
                        </section>

                        {/* SECTION 4: USER - 3 charts (3 col) */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Người dùng</h2>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <UserDemographicsChart demographics={statsData.demographics} />
                                <RoleStatsChart usersByRole={statsData.usersByRole} />
                                <ActiveRetentionChart activeRetention={statsData.activeRetention} />
                            </div>
                        </section>

                        {/* SECTION 5: PRODUCT - 3 charts (3 col) */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm</h2>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <ProductCategoryChart productsByCategory={statsData.productsByCategory} />
                                {/* <TopAttributesChart topAttributes={statsData.topAttributes} /> */}
                                {/* <ProductImagesStatsChart productImagesStats={statsData.productImagesStats} /> */}
                            </div>
                        </section>

                        {/* SECTION 6: SALES & INSIGHTS - 3 charts (3 col) */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bán hàng & Đánh giá</h2>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <PaymentMethodChart paymentByMethod={statsData.paymentByMethod} />
                                <OrdersByRegionChart ordersByRegion={statsData.ordersByRegion} />
                                <RatingStatsChart ratingStats={statsData.ratingStats} />
                            </div>
                        </section>

                        {/* SECTION 7: DETAILED - BestSellerTable (full width) */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm bán chạy chi tiết</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <BestSellerTable bestSellingVariants={statsData.bestSellingVariants} />
                            </div>
                        </section>
                    </motion.div>
                </main>
            </div>
        </LayoutAdmin>
    );
};

export default DashboardAdminPage;