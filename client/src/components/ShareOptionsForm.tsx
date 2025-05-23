import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Song, CeremonyMoment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  coupleNames: string;
  weddingDate: string;
  email: string;
  phone: string;
  notes: string;
}

interface ShareOptionsFormProps {
  selectedSongs: { [key in CeremonyMoment]?: number } | null;
  songsData: Song[];
  isComplete: boolean;
  onIncompleteSubmit?: (callback: () => void) => void;
}

export default function ShareOptionsForm({ 
  selectedSongs, 
  songsData, 
  isComplete,
  onIncompleteSubmit
}: ShareOptionsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      coupleNames: "",
      weddingDate: "",
      email: "",
      phone: "",
      notes: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedSongs || Object.keys(selectedSongs).length === 0) {
      toast({
        title: "Cannot submit",
        description: "Please select at least one song for your ceremony.",
        variant: "destructive"
      });
      return;
    }

    const submitAction = async () => {
      setIsSubmitting(true);

      try {
        // Transform the selected songs to include song details
        const songSelections = Object.entries(selectedSongs).map(([moment, songId]) => {
          const song = songsData.find(s => s.id === songId);
          return {
            moment,
            songId,
            songTitle: song?.title || 'Unknown Song'
          };
        });

        // Submit the form data and selections to the API
        await apiRequest('POST', '/api/submit-selections', {
          ...data,
          songSelections
        });

        toast({
          title: "Submission Successful",
          description: "Your song selections have been sent to the choir.",
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error sending your selections. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    // If it's complete or no confirmation function is provided, just submit
    if (isComplete || !onIncompleteSubmit) {
      submitAction();
    } else {
      // Otherwise use the confirmation function
      onIncompleteSubmit(submitAction);
    }
  };

  return (
    <div>
      <h4 className="font-display text-lg font-semibold text-primary mb-4">Send to Choir</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="couple-names" className="block text-sm font-medium text-neutral-700 mb-1">
            Couple Names
          </Label>
          <Input
            id="couple-names"
            placeholder="John & Jane"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            {...register("coupleNames", { required: "Couple names are required" })}
          />
          {errors.coupleNames && (
            <p className="text-red-600 text-sm mt-1">{errors.coupleNames.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="wedding-date" className="block text-sm font-medium text-neutral-700 mb-1">
            Wedding Date
          </Label>
          <Input
            type="date"
            id="wedding-date"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            {...register("weddingDate", { required: "Wedding date is required" })}
          />
          {errors.weddingDate && (
            <p className="text-red-600 text-sm mt-1">{errors.weddingDate.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              } 
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
            Phone (for WhatsApp)
          </Label>
          <Input
            type="tel"
            id="phone"
            placeholder="+1234567890"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <Label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
            Notes for the Choir
          </Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Any special requests or information..."
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            {...register("notes")}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full px-4 py-2 bg-accent-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
          disabled={!selectedSongs || Object.keys(selectedSongs).length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit Selections"
          )}
        </Button>
      </form>
    </div>
  );
}
