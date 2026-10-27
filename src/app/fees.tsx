import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { downloadAndOpenPdf } from "../api/pdf";
import { StickyHeader } from "../components/StickyHeader";
import { useI18n } from "../i18n";

export interface FeeBill {
  id: string;
  month: string;
  amount: number;
  status: "past_due" | "paid" | "upcoming";
  statusText?: string;
  paidAmount?: number;
  dueDate: string;
  invoiceNumber: string;
}

const FEE_BILLS: FeeBill[] = [
  {
    id: "BILL-2026-09",
    month: "September 2026",
    amount: 22500,
    status: "past_due",
    statusText: "Past due date",
    paidAmount: 0,
    dueDate: "Due Thu 10 Sept",
    invoiceNumber: "INV-2026-09",
  },
  {
    id: "BILL-2026-08",
    month: "August 2026",
    amount: 22500,
    status: "paid",
    statusText: "Paid",
    paidAmount: 22500,
    dueDate: "Due Mon 10 Aug",
    invoiceNumber: "INV-2026-08",
  },
  {
    id: "BILL-2026-07",
    month: "July 2026",
    amount: 22500,
    status: "paid",
    statusText: "Paid",
    paidAmount: 22500,
    dueDate: "Due Fri 10 Jul",
    invoiceNumber: "INV-2026-07",
  },
];

export default function FeesScreen() {
  const { selectedChild, isAuthenticated } = useAuth();
  const { t, isRTL } = useI18n();
  const [bills, setBills] = useState<FeeBill[]>(FEE_BILLS);
  const [totalDue, setTotalDue] = useState<number>(22500);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  const fetchFees = useCallback(async () => {
    if (
      !selectedChild?.id ||
      selectedChild.id.startsWith("STD-DEMO") ||
      !isAuthenticated
    ) {
      return;
    }
    try {
      const data = await api.fees(selectedChild.id);
      if (data && Array.isArray(data.invoices) && data.invoices.length > 0) {
        setTotalDue(data.totalDuePkr);
        const mapped: FeeBill[] = data.invoices.map((inv) => {
          const isOverdue = inv.status === "OVERDUE";
          const isPaid = inv.status === "PAID";
          return {
            id: inv.id,
            month: inv.period,
            amount: inv.totalPkr,
            status: isOverdue ? "past_due" : isPaid ? "paid" : "upcoming",
            statusText: isOverdue
              ? "Past due date"
              : isPaid
              ? "Paid"
              : "Upcoming",
            paidAmount: inv.paidPkr,
            dueDate: `Due ${inv.dueOn}`,
            invoiceNumber: inv.number,
          };
        });
        setBills(mapped);
      }
    } catch {
      // Fallback to local default data
    }
  }, [selectedChild?.id, isAuthenticated]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFees();
    setRefreshing(false);
  };

  const handleOpenFeeSlip = async (bill: FeeBill) => {
    try {
      if (
        selectedChild?.id &&
        !selectedChild.id.startsWith("STD-DEMO") &&
        isAuthenticated
      ) {
        await downloadAndOpenPdf(
          `/parent/children/${selectedChild.id}/invoices/${bill.id}/challan`,
          `fee-slip-${bill.invoiceNumber || bill.id}.pdf`
        );
      } else {
        await downloadAndOpenPdf(
          `/parent/children/sample/invoices/${bill.id}/challan`,
          `fee-slip-${bill.invoiceNumber || "2026"}.pdf`
        );
      }
    } catch {
      Alert.alert(
        "Fee Voucher",
        `Opening official fee voucher for ${bill.invoiceNumber} (${bill.month}).`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={["bottom", "left", "right"]}>
      {/* Pinned Sticky Header */}
      <StickyHeader title={t("fees.screenTitle")} onBack={handleBack} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Card: Total to pay */}
        <View className="bg-white rounded-3xl py-6 px-6 border border-gray-100 shadow-sm items-center justify-center mb-6">
          <Text className="text-[14px] text-gray-500 font-medium text-center mb-1">
            {t("fees.totalToPay")}
          </Text>
          <Text className="text-[36px] font-extrabold text-[#DC2626] text-center tracking-tight">
            Rs. {totalDue.toLocaleString()}
          </Text>
        </View>

        {/* Section Heading: Fee bills */}
        <Text
          className={`text-[17px] font-bold text-gray-900 mb-3 px-1 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("fees.feeBills")}
        </Text>

        {/* List of Fee Bill Cards */}
        <View>
          {bills.map((bill) => {
            const isPastDue = bill.status === "past_due";
            const isPaid = bill.status === "paid";

            return (
              <View
                key={bill.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4"
              >
                {/* Header Row: Month & Status Badge */}
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-[16px] font-bold text-gray-900">
                    {bill.month}
                  </Text>

                  <View
                    className={`px-3 py-1 rounded-full ${
                      isPastDue
                        ? "bg-[#FEE2E2]"
                        : isPaid
                        ? "bg-[#D1FAE5]"
                        : "bg-amber-50"
                    }`}
                  >
                    <Text
                      className={`text-[12px] font-semibold ${
                        isPastDue
                          ? "text-[#DC2626]"
                          : isPaid
                          ? "text-[#059669]"
                          : "text-amber-700"
                      }`}
                    >
                      {bill.statusText}
                    </Text>
                  </View>
                </View>

                {/* Amount */}
                <Text className="text-[22px] font-extrabold text-gray-900 mt-1">
                  Rs. {bill.amount.toLocaleString()}
                </Text>

                {/* Status Subtitle: Left to pay or Paid summary */}
                {isPastDue ? (
                  <Text className="text-[13px] font-semibold text-[#DC2626] mt-1">
                    Left to pay: Rs.{" "}
                    {(bill.amount - (bill.paidAmount || 0)).toLocaleString()}
                  </Text>
                ) : (
                  <Text className="text-[13px] font-medium text-gray-500 mt-1">
                    Paid Rs. {(bill.paidAmount || 0).toLocaleString()} of Rs.{" "}
                    {bill.amount.toLocaleString()}
                  </Text>
                )}

                {/* Due Date */}
                <Text className="text-[12.5px] text-gray-400 mt-0.5 mb-4">
                  {bill.dueDate}
                </Text>

                {/* "Open fee slip" Outline Button */}
                <TouchableOpacity
                  onPress={() => handleOpenFeeSlip(bill)}
                  activeOpacity={0.7}
                  className="w-full border border-gray-200 rounded-2xl py-3 flex-row items-center justify-center bg-white"
                >
                  <Ionicons
                    name="document-text-outline"
                    size={17}
                    color="#1F2937"
                  />
                  <Text className="text-[14px] font-bold text-gray-800 ml-2">
                    Open fee slip
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Bottom Return Action */}
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="mt-4 py-2.5 items-center justify-center"
        >
          <Text className="text-[13px] font-semibold text-gray-400">
            ← Return to Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
