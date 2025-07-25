import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Activity,
  Plus,
  CheckCircle,
  MapPin,
} from "lucide-react";

import { MemberRoles } from "@/validation/schema";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import SearchPanel from './SearchPanel';
import CoordinatesPanel from './CoordinatesPanel';
import MapPanel from './MapPanel';

type Props = {
  form: any;
  onSubmit: (data: any) => void;
  isEditMode?: boolean;
};

export default function MemberFormCard({ form, onSubmit, isEditMode = false }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Localisation state lié au form
  const [address, setAddress] = useState(form.watch('address') || '');
  const [position, setPosition] = useState([
    form.watch('lat') || 33.9716,
    form.watch('lng') || -6.8498
  ]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSelectSuggestion = (suggestion: { label: string; y: number; x: number }) => {
    setAddress(suggestion.label);
    setPosition([suggestion.y, suggestion.x]);
    setSuggestions([]);
    form.setValue('address', suggestion.label);
    form.setValue('lat', suggestion.y);
    form.setValue('lng', suggestion.x);
  };

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const lat = position[0] + (0.5 - y) * 0.02;
    const lng = position[1] + (x - 0.5) * 0.02;
    setPosition([lat, lng]);
    form.setValue('lat', lat);
    form.setValue('lng', lng);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const result = await response.json();
      if (result && result.display_name) {
        setAddress(result.display_name);
        form.setValue('address', result.display_name);
      }
    } catch {}
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setAddress('Current Location');
          form.setValue('lat', pos.coords.latitude);
          form.setValue('lng', pos.coords.longitude);
          form.setValue('address', 'Current Location');
        },
        () => {
          alert('Unable to retrieve your location');
        }
      );
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {isEditMode ? t('members.editTitle') : t('members.infoTitle')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditMode 
                ? t('members.editCardSubtitle')
                : t('members.infoSubtitle')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section informations personnelles */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">{t('members.personalInfo')}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {t('members.fullName')} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('members.fullNamePlaceholder')} 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {t('members.email')} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={t('members.emailPlaceholder')} 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section rôle et statut */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">{t('members.roleStatus')}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        {t('members.role')} *
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('members.rolePlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MemberRoles.map((role) => (
                            <SelectItem 
                              key={role} 
                              value={role}
                            >
                              <div className="flex items-center gap-3">
                                <span>{role}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        {t('members.status')}
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('members.statusPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>{t('members.active')}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span>{t('members.inactive')}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section date */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">{t('members.timeline')}</h3>
              </div>
              
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="space-y-2 max-w-sm">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {t('members.joinDate')} *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="h-11"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            {/* Section localisation */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="w-4 h-4 text-red-500" />
                <h3 className="font-medium">{t('members.location') || 'Localisation'}</h3>
              </div>
              <SearchPanel
                address={address}
                setAddress={setAddress}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                onSelectSuggestion={handleSelectSuggestion}
                onGetCurrentLocation={getCurrentLocation}
              />
              <CoordinatesPanel position={position} />
              <MapPanel position={position} onMapClick={handleMapClick} />
            </div>

            {/* Preview card si le formulaire est valide */}
            {form.formState.isValid && form.watch("name") && form.watch("email") && form.watch("role") && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <h3 className="font-medium">{t('members.preview')}</h3>
                </div>
                <div className="bg-accent rounded-lg p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{form.watch("name")}</h4>
                      <p className="text-sm text-muted-foreground">{form.watch("email")}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {form.watch("role")}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${form.watch("status") === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${form.watch("status") === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {form.watch("status") === 'active' ? t('members.active') : t('members.inactive')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/members")}
                className="h-11 px-6"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="h-11 px-8"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isEditMode ? t('members.updateMember') : t('members.addMember')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}