"use client";

import React, { useState, useCallback, useTransition } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader, Plus, Trash2, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { jobPostingSchema } from "@/lib/validators";
import { createJobPosting } from "@/lib/action";
import toast from "react-hot-toast";

// Types for form data
type JobPostingFormValues = z.infer<typeof jobPostingSchema>;

// Social media platform options
const socialMediaPlatforms = [
  "LinkedIn",
  "Twitter",
  "Facebook",
  "Instagram",
  "YouTube",
];

// Organization types
const organizationTypes = [
  "Private",
  "Public",
  "Government",
  "Non-Profit",
  "Startup",
];

// Industry types
const industryTypes = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Construction",
  "Entertainment",
  "Food & Beverage",
];

// Team sizes
const teamSizes = [
  "1-10",
  "11-50",
  "51-100",
  "101-200",
  "200+",
  "500+",
  "1000+",
];

function AddJobPostingModal<T extends FieldValues>({
  defaultValues,
}: {
  defaultValues: T;
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("step1");
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const [uploading, setUploading] = useState(false);

  // Initialize the form
  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // Watch form values for validation
  const watchedValues = form.watch();

  // Step validation functions - memoize these to prevent infinite loops
  const isStep1Valid = useCallback(() => {
    try {
      jobPostingSchema
        .pick({
          companyName: true,
          companyLogo: true,
        })
        .parse({
          companyName: watchedValues.companyName,
          companyLogo: watchedValues.companyLogo,
        });
      return true;
    } catch (error) {
      return false;
    }
  }, [watchedValues.companyName, watchedValues.companyLogo]);

  const isStep2Valid = useCallback(() => {
    try {
      jobPostingSchema
        .pick({
          organizationType: true,
          industryTypes: true,
          teamSize: true,
          companyWebsite: true,
          // Remove yearOfEstablishment from required validation if keeping it optional
        })
        .parse({
          organizationType: watchedValues.organizationType,
          industryTypes: watchedValues.industryTypes,
          teamSize: watchedValues.teamSize,
          companyWebsite: watchedValues.companyWebsite,
        });
      return true;
    } catch (error) {
      return false;
    }
  }, [
    watchedValues.organizationType,
    watchedValues.industryTypes,
    watchedValues.teamSize,
    watchedValues.companyWebsite,
  ]);

  const isStep3Valid = useCallback(() => {
    try {
      jobPostingSchema
        .pick({
          socialMediaProfiles: true,
        })
        .parse({
          socialMediaProfiles: watchedValues.socialMediaProfiles,
        });
      return true;
    } catch (error) {
      return false;
    }
  }, [watchedValues.socialMediaProfiles]);

  // Get allowed tabs based on completed steps
  const getAllowedTabs = useCallback(() => {
    const allowedTabs = ["step1"];

    if (isStep1Valid()) {
      allowedTabs.push("step2");
    }

    if (isStep1Valid() && isStep2Valid()) {
      allowedTabs.push("step3");
    }

    if (isStep1Valid() && isStep2Valid() && isStep3Valid()) {
      allowedTabs.push("step4");
    }

    return allowedTabs;
  }, [isStep1Valid, isStep2Valid, isStep3Valid]);

  // Handle tab change with validation
  const handleTabChange = useCallback(
    (newTab: string) => {
      const allowedTabs = getAllowedTabs();
      if (allowedTabs.includes(newTab)) {
        setActiveTab(newTab);
      }
    },
    [getAllowedTabs]
  );

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setUploading(true);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          setCompanyLogoPreview(data.url);
          form.setValue("companyLogo", data.url);
          setUploading(false);
        } else {
          console.error("Upload failed:", data.error);
          setUploading(false);
        }
      } catch (error) {
        console.log("Error uploading logo:", error);
        setUploading(false);
      }
    }
  };

  // Add social media profile
  const addSocialMediaProfile = useCallback(() => {
    const currentProfiles = form.getValues("socialMediaProfiles") || [];
    form.setValue("socialMediaProfiles", [
      ...currentProfiles,
      { platform: "LinkedIn", url: "" },
    ]);
  }, [form]);

  // Remove social media profile
  const removeSocialMediaProfile = useCallback(
    (index: number) => {
      const currentProfiles = form.getValues("socialMediaProfiles") || [];
      form.setValue(
        "socialMediaProfiles",
        currentProfiles.filter((_, i) => i !== index)
      );
    },
    [form]
  );

  // Handle form submission
  // Handle form submission
  const handleFormSubmit = async (data: JobPostingFormValues) => {
    startTransition(async () => {
      setOpen(false);
      setUploading(false);
      setCompanyLogoPreview(null);

      // Ensure yearOfEstablishment is included even if undefined
      const submissionData = {
        ...data,
        yearOfEstablishment: data.yearOfEstablishment || null, // Convert undefined to null
      };

      console.log("Submitting job posting data:", submissionData);

      const response = await createJobPosting(submissionData);
      if (response.success) {
        form.reset();
        toast.success("Job posting created successfully!");
      } else {
        toast.error("Failed to create job posting: " + response.error);
      }
    });
  };

  const allowedTabs = getAllowedTabs();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="group relative rounded-md cursor-pointer px-6 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-2xl transition-all duration-300 font-semibold text-balance"
          size={"sm"}
        >
          <span className="relative z-10 flex items-center gap-2">
            Post an Opening
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/20 shadow-2xl text-white h-[620px] overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="h-full flex flex-col overflow-y-auto hide-scrollbar"
          >
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-6 bg-slate-800/50 border border-white/10">
                <TabsTrigger
                  value="step1"
                  className="text-slate-100/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white cursor-pointer"
                >
                  Company
                </TabsTrigger>
                <TabsTrigger
                  value="step2"
                  disabled={!allowedTabs.includes("step2")}
                  className="text-slate-100/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="step3"
                  disabled={!allowedTabs.includes("step3")}
                  className="text-slate-100/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Social
                </TabsTrigger>
                <TabsTrigger
                  value="step4"
                  disabled={!allowedTabs.includes("step4")}
                  className="text-slate-100/60 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contact
                </TabsTrigger>
              </TabsList>

              {/* Step 1: Company Info */}
              <TabsContent value="step1" className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Company Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter company name"
                          {...field}
                          className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Company Logo Upload */}
                  <div className="space-y-2">
                    <FormLabel className="text-white">Upload Logo *</FormLabel>
                    <div className="relative h-[180px] border-2 border-dashed rounded-lg border-white/20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
                      {companyLogoPreview ? (
                        <>
                          <div className="relative w-full h-full">
                            <Image
                              src={companyLogoPreview}
                              alt="Company logo preview"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <label
                              htmlFor="logo-upload"
                              className="cursor-pointer flex items-center gap-2 bg-white/20 px-3 py-2 rounded-md text-white text-sm hover:bg-white/30 transition-all"
                            >
                              <Upload size={16} />
                              Change Logo
                            </label>
                          </div>
                        </>
                      ) : uploading ? (
                        <div className="flex items-center justify-center h-full gap-4">
                          <Loader className="animate-spin h-6 w-6 text-white" />
                          <span className="text-white">Uploading...</span>
                        </div>
                      ) : (
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-center p-4"
                        >
                          <div className="rounded-full bg-white/10 p-3">
                            <Upload className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-sm font-medium text-white">
                            Browse photo or drop here
                          </div>
                          <p className="text-xs text-gray-400">
                            A photo larger than 400 pixels work best. Max photo
                            size 5 MB.
                          </p>
                        </label>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="aboutUs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        About Company
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about your company"
                          {...field}
                          className="bg-white/10 border-white/20 text-white focus:border-orange-500 min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("step2")}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
                    disabled={!isStep1Valid()}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              {/* Step 2: Founding Info */}
              <TabsContent value="step2" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Organization Type *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-orange-500">
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-white/20 text-white">
                            {organizationTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Team Size *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-orange-500">
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-white/20 text-white">
                            {teamSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="industryTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Industry Types *
                      </FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {industryTypes.map((type) => (
                          <div
                            key={type}
                            onClick={() => {
                              const currentSelection = field.value || [];
                              const newSelection = currentSelection.includes(
                                type
                              )
                                ? currentSelection.filter(
                                    (item) => item !== type
                                  )
                                : [...currentSelection, type];
                              field.onChange(newSelection);
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all ${
                              field.value?.includes(type)
                                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearOfEstablishment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Year of Establishment
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Year of Establishment"
                          {...field}
                          className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Company Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://your-company.com"
                          {...field}
                          className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyVision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Company Vision
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is your company's vision?"
                          {...field}
                          className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("step1")}
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("step3")}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
                    disabled={!isStep2Valid()}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              {/* Step 3: Social Media */}
              <TabsContent value="step3" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">
                    Social Media Profiles *
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSocialMediaProfile}
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Profile
                  </Button>
                </div>

                {form.watch("socialMediaProfiles")?.map((_, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`socialMediaProfiles.${index}.platform`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-white">Platform</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-orange-500">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              {socialMediaPlatforms.map((platform) => (
                                <SelectItem key={platform} value={platform}>
                                  {platform}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`socialMediaProfiles.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-[2]">
                          <FormLabel className="text-white">URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/profile"
                              {...field}
                              className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSocialMediaProfile(index)}
                      className="mb-0.5"
                      disabled={form.watch("socialMediaProfiles")?.length === 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("step2")}
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("step4")}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
                    disabled={!isStep3Valid()}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              {/* Step 4: Contact Info */}
              <TabsContent value="step4" className="space-y-4">
                <FormField
                  control={form.control}
                  name="mapLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Office Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter office address"
                          {...field}
                          className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact number"
                            {...field}
                            className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact email"
                            {...field}
                            className="bg-white/10 border-white/20 text-white focus:border-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("step3")}
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
                    disabled={isPending}
                  >
                    Submit Job Posting
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(AddJobPostingModal);
