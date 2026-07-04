"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { partnerApplicationActions } from "@/lib/actions/partnerApplication.actions";
import { partnerApplicationSchema } from "@/constants";

type PartnerApplicationFormValues = z.infer<typeof partnerApplicationSchema>;

export function PartnerApplicationForm() {
  const form = useForm<PartnerApplicationFormValues>({
    resolver: zodResolver(partnerApplicationSchema),
    defaultValues: {
      hotelName: "",
      description: "",
    },
  });

  const onSubmit = async (values: PartnerApplicationFormValues) => {
    const res = await partnerApplicationActions(
      values.hotelName,
      values.description,
    );

    if (res.success) {
      form.reset();
      toast.success("Candidatura enviada com sucesso!");
    } else {
      toast.error(res.error ?? "Erro ao enviar candidatura");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md"
      >
        <div>
          <h2 className="text-xl font-semibold">
            Candidatura a Parceiro StayNet
          </h2>
          <p className="text-sm text-muted-foreground">
            Envia a tua candidatura para te tornares parceiro da plataforma.
          </p>
        </div>

        <FormField
          control={form.control}
          name="hotelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do hotel</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Hotel Atlântico" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Fala-nos um pouco sobre o hotel..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "A enviar..." : "Enviar candidatura"}
        </Button>
      </form>
    </Form>
  );
}
