import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import MultiPhotoUpload from './MultiPhotoUpload';
import { PropertyType, FurnishingStatus, ExternalBlob } from '../../backend';

interface PropertyFormProps {
  initialData?: {
    title: string;
    location: string;
    propertyType: PropertyType;
    furnishingStatus: FurnishingStatus;
    areaSquareFeet: string;
    price: string;
    description: string;
    images: ExternalBlob[];
    numberOfWashrooms: string;
    permitNumber: string;
  };
  onSubmit: (data: {
    title: string;
    location: string;
    propertyType: PropertyType;
    furnishingStatus: FurnishingStatus;
    areaSquareFeet: string;
    price: string;
    description: string;
    images: ExternalBlob[];
    numberOfWashrooms: string;
    permitNumber: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export default function PropertyForm({ initialData, onSubmit, isSubmitting, submitLabel }: PropertyFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [propertyType, setPropertyType] = useState<PropertyType>(initialData?.propertyType || PropertyType.office);
  const [furnishingStatus, setFurnishingStatus] = useState<FurnishingStatus>(
    initialData?.furnishingStatus || FurnishingStatus.unfurnished
  );
  const [areaSquareFeet, setAreaSquareFeet] = useState(initialData?.areaSquareFeet || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [images, setImages] = useState<ExternalBlob[]>(initialData?.images || []);
  const [numberOfWashrooms, setNumberOfWashrooms] = useState(initialData?.numberOfWashrooms || '');
  const [permitNumber, setPermitNumber] = useState(initialData?.permitNumber || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !location.trim() || !areaSquareFeet || !price || !description.trim()) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      location: location.trim(),
      propertyType,
      furnishingStatus,
      areaSquareFeet,
      price,
      description: description.trim(),
      images,
      numberOfWashrooms,
      permitNumber: permitNumber.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Modern Office Space in DIFC"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Building Name, Area) *</Label>
              <Input
                id="location"
                placeholder="e.g., Al Manara Tower, Business Bay"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Format: Building Name, Area Name
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select value={propertyType} onValueChange={(value) => setPropertyType(value as PropertyType)}>
                <SelectTrigger id="propertyType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PropertyType.office}>
                    <div className="flex items-center gap-2">
                      <img src="/assets/generated/icon-office.dim_256x256.png" alt="" className="h-4 w-4" />
                      Office
                    </div>
                  </SelectItem>
                  <SelectItem value={PropertyType.retail}>
                    <div className="flex items-center gap-2">
                      <img src="/assets/generated/icon-retail.dim_256x256.png" alt="" className="h-4 w-4" />
                      Retail
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="furnishingStatus">Furnishing Status *</Label>
              <Select value={furnishingStatus} onValueChange={(value) => setFurnishingStatus(value as FurnishingStatus)}>
                <SelectTrigger id="furnishingStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FurnishingStatus.furnished}>Furnished</SelectItem>
                  <SelectItem value={FurnishingStatus.semiFurnished}>Semi-Furnished</SelectItem>
                  <SelectItem value={FurnishingStatus.unfurnished}>Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaSquareFeet">Area (SQFT) *</Label>
              <Input
                id="areaSquareFeet"
                type="number"
                placeholder="e.g., 1500"
                value={areaSquareFeet}
                onChange={(e) => setAreaSquareFeet(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (AED) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfWashrooms">Washrooms *</Label>
              <Input
                id="numberOfWashrooms"
                type="number"
                placeholder="e.g., 2"
                value={numberOfWashrooms}
                onChange={(e) => setNumberOfWashrooms(e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="permitNumber">Permit Number</Label>
              <Input
                id="permitNumber"
                placeholder="e.g., DLD-123456"
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the property, its features, amenities, and any other relevant details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Property Photos</Label>
            <MultiPhotoUpload images={images} onChange={setImages} />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
