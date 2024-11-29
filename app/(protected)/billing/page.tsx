"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserCredits } from "../../../server/actions/credits.ts";
import { Input } from "../../../components/ui/input.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { toast } from "sonner";
import { Slider } from "../../../components/ui/slider.tsx";
import { Info } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { createPaymentTransaction } from "../../../server/actions/credits.ts";
import LoadingScreen from "../../loading.tsx";
export default function BillingPage() {
  const {
    data: credits,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["credits"],
    queryFn: getUserCredits,
  });

  const [creditsToBuy, setCreditsToBuy] = useState<number>(100);

  const price = (creditsToBuy * 0.5).toFixed(2);

  const [processing, setProcessing] = useState(false);

  if (isLoading) return <LoadingScreen />;

  if (error) return <div>{error.message}</div>;

  if (credits?.error) return <div>{credits.error}</div>;

  const onPayPalApprove = async () => {
    console.log("payment approved");
    setProcessing(true);
    const { success, error } = await createPaymentTransaction(creditsToBuy);

    if (success) {
      setProcessing(false);
      toast.success("Payment successful");
      return;
    }

    if (error) {
      setProcessing(false);
      return toast.error(error);
    }
    setProcessing(false);
    toast.success("Payment successful");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Billing</h1>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col gap-2 items-center">
          <CardTitle>Credit Balance</CardTitle>
          <CardDescription>You have {credits?.credits} credits remaining.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="creditsToBuy"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Credits to Buy: {creditsToBuy}
              </label>
              <Slider
                id="creditsToBuy"
                min={100}
                max={10000}
                step={100}
                value={[creditsToBuy]}
                onValueChange={(value) => setCreditsToBuy(value[0])}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <Input type="text" id="price" value={`$${price}`} readOnly className="bg-gray-100" />
            </div>
          </form>

          <div className="flex my-4 flex-col gap-2 bg-blue-50 px-4 py-2 rounded-md border border-blue-200 text-blue-700">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <p className="text-sm">
                Each credits allows you to index single file in the repository.
              </p>
            </div>
            <p className="text-sm">
              Example: If you have 100 credits and the repository has 100 files, you can index all
              of them.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {processing ? (
            <Button disabled>Processing...</Button>
          ) : (
            <PayPalButtons
              style={{ layout: "horizontal" }}
              onApprove={async () => await onPayPalApprove()}
              onCancel={() => toast.error("Payment cancelled")}
              onError={(error) => toast.error(error?.message)}
              createOrder={(_, actions) => {
                console.log(price);
                return actions?.order?.create({
                  purchase_units: [{ amount: { value: price, currency_code: "USD" } }],
                  intent: "CAPTURE",
                });
              }}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
