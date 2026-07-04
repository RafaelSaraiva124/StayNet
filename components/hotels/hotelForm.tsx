"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createHotel } from "@/lib/actions/hotel.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CldUploadWidget } from "next-cloudinary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { ImagePlus, X, BedSingle, BedDouble, Euro } from "lucide-react";
import { createHotelSchema } from "@/lib/validations";

type FormValues = z.input<typeof createHotelSchema>;

export function CreateHotelForm() {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(createHotelSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      country: "Portugal",
      email: "",
      phone: "",
      images: [],
      singleRoomTotal: 0,
      singleRoomPrice: undefined,
      singleRoomDescription: "",
      doubleRoomTotal: 0,
      doubleRoomPrice: undefined,
      doubleRoomDescription: "",
    },
  });

  const images = form.watch("images") ?? [];
  const singleTotal = form.watch("singleRoomTotal") || 0;
  const doubleTotal = form.watch("doubleRoomTotal") || 0;
  const hasAtLeastOneRoom = singleTotal > 0 || doubleTotal > 0;

  function onSubmit(values: FormValues) {
    if (!hasAtLeastOneRoom) {
      toast.error("É obrigatório configurar pelo menos um tipo de quarto");
      return;
    }

    startTransition(async () => {
      const res = await createHotel({
        ...values,
        images: values.images ?? [],
      });

      if (!res.success) {
        toast.error(res.error ?? "Erro ao adicionar hotel");
        return;
      }

      toast.success("Hotel adicionado com sucesso!");
      form.reset();
    });
  }

  function addImage(url: string, publicId: string) {
    const current = form.getValues("images") ?? [];
    form.setValue("images", [...current, { url, publicId }], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function removeImage(index: number) {
    const current = form.getValues("images") ?? [];
    const next = current.filter((_, i) => i !== index);
    form.setValue("images", next, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados gerais do hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do hotel</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Hotel Bragança" {...field} />
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
                        placeholder="Breve descrição do hotel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Bragança" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input placeholder="Portugal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Morada</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua..., nº..., ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contacto</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="hotel@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+351 123 456 789"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuração de Quartos</CardTitle>
              <CardDescription>
                Configure os tipos de quartos disponíveis (obrigatório pelo
                menos um tipo)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BedSingle className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Quartos Individuais</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="singleRoomTotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de quartos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Número total de quartos individuais
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="singleRoomPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço por noite (€)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-9"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  parseFloat(e.target.value) || undefined,
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="singleRoomDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição dos quartos individuais..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">
                    Quartos Duplos (Opcional)
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="doubleRoomTotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de quartos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Número total de quartos duplos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doubleRoomPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço por noite (€)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-9"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  parseFloat(e.target.value) || undefined,
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="doubleRoomDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição dos quartos duplos..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!hasAtLeastOneRoom && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  É obrigatório configurar pelo menos um tipo de quarto para
                  adicionar o hotel!
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagens do Hotel</CardTitle>
              <CardDescription>
                Adicione fotos do hotel (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  multiple: true,
                  maxFiles: 20,
                }}
                onSuccess={(result: any) => {
                  const info = result?.info;
                  const url = info?.secure_url;
                  const publicId = info?.public_id;

                  if (url && publicId) addImage(url, publicId);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      Clica para adicionar imagens
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ({images.length} selecionada(s))
                    </p>
                  </button>
                )}
              </CldUploadWidget>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {images.map((img, index) => (
                    <div
                      key={img.publicId + index}
                      className="relative h-28 overflow-hidden rounded-lg border"
                    >
                      <img
                        src={img.url}
                        alt={`Imagem ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                        aria-label="Remover imagem"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isPending || !hasAtLeastOneRoom}
              size="lg"
              className="min-w-[200px]"
            >
              {isPending ? "A criar..." : "Criar hotel"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
