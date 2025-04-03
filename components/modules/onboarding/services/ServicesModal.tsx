import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service, serviceSchema } from "./constants";
import { ServiceForm } from "./ServicesForm";

type ServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeService: Service | null;
  onSave: (service: Service, index?: number) => void;
  serviceIndex?: number;
};

export const ServicesModal = ({ 
  isOpen, 
  onClose, 
  activeService, 
  onSave,
  serviceIndex 
}: ServiceModalProps) => {
  const form = useForm<Service>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      serviceType: "",
      hours: "1",
      minutes: "00",
      price: "",
      startsAt: false,
    }
  });

  const { reset, formState: { isSubmitting } } = form;

  // Reset form when activeService changes
  useEffect(() => {
    if (activeService) {
      reset({
        name: activeService.name || "",
        serviceType: activeService.serviceType || "",
        hours: activeService.hours || "1",
        minutes: activeService.minutes || "00",
        price: activeService.price || "",
        startsAt: activeService.startsAt || false,
      });
    }
  }, [activeService, reset]);

  const onSubmit = (data: Service) => {
    onSave(data, serviceIndex);
    onClose();
  };

  const isEditing = serviceIndex !== undefined;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      modalContainerClassName="w-full max-w-md p-6"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {isEditing ? "Edit Service" : "Add New Service"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing 
              ? "Update your service details below" 
              : "Fill in the details for your new service"}
          </p>
        </div>

        <FormProvider {...form}>
          <ServiceForm 
            onSubmit={onSubmit}
            onCancel={onClose}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
          />
        </FormProvider>
      </div>
    </Modal>
  );
}
