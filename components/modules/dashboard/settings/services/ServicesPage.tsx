'use client';

import { useFetchBusinessServicesInfiniteQuery } from '@/app/api/services';
import { FadeIn } from '@/components/common/fade-in';
import InfiniteScrollList from '@/components/common/InfiniteScroll';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Clock, DollarSign, Edit, Plus, SearchX, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export const DashboardServicesPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchNextPage, services, isLoading: isServicesLoading, isFetchingNextPage } = useFetchBusinessServicesInfiniteQuery(1, 10, searchQuery);

  // Extract unique categories from services
  const serviceCategories = useMemo(() => {
    if (!services) return [];
    const categories = [{ _id: 'all', name: 'all' }, ...new Set(services.map((service) => service?.service_category))];
    return categories.filter(Boolean); // Remove any undefined/null values
  }, [services]);

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (!searchQuery.trim()) return services;

    const query = searchQuery.toLowerCase();
    return services.filter((service) => service.name.toLowerCase().includes(query) || service?.description?.toLowerCase().includes(query));
  }, [searchQuery, services]);

  const handleManageService = (serviceId: string) => {
    router.push(`/dashboard/settings/business-services/${serviceId}`);
  };

  return (
    <FadeIn className='max-w-7xl mx-auto py-8  px-5'>
      <InfiniteScrollList
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        className='!w-full space-y-8'
      >
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold'>My Services</h1>
            <p className='text-muted-foreground mt-1'>Manage your business services and offerings</p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/settings/business-services/new')}
            className='sm:self-start'
          >
            <Plus className='mr-2 h-4 w-4' /> Add New Service
          </Button>
        </div>

        <div className='w-full max-w-md'>
          <SearchInput
            type='search'
            placeholder='Search services by name, description or category...'
            className='pl-8'
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e)}
          />
        </div>

        {isServicesLoading ? (
          <Loader text='Loading...' />
        ) : (
          <Tabs
            className='border flex w-full lg:flex-row flex-col rounded-md bg-white min-h-[80vh]'
            defaultValue='all'
          >
            <div className='flex-1/3 border-r p-4 lg:max-w-[250px]'>
              <h2 className='font-semibold mb-3 flex items-center'>
                <Tag className='h-4 w-4 mr-2' /> Categories
              </h2>
              <TabsList className='w-full flex flex-col h-auto space-y-1'>
                {serviceCategories.map((category) => (
                  <TabsTrigger
                    key={category._id}
                    value={category._id ?? ''}
                    className='justify-start px-3 py-2 h-9 w-full'
                  >
                    {category._id === 'all' ? 'All Services' : category && capitalizeFirstLetter(category.name)}
                    <Badge
                      variant='outline'
                      className='ml-auto'
                    >
                      {category._id === 'all' ? filteredServices.length : filteredServices.filter((s) => s?.service_category === category).length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className='flex-1 p-6 overflow-auto'>
              {serviceCategories.map((category) => (
                <TabsContent
                  key={category?._id}
                  value={category?.name ?? ''}
                  className='space-y-6 mt-0'
                >
                  {searchQuery && (
                    <div className='mb-4'>
                      <p className='text-sm text-muted-foreground'>
                        {filteredServices.filter((service) => category._id === 'all' || service?.service_category === category).length} results found
                        for "{searchQuery}"
                      </p>
                    </div>
                  )}

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  min-h-[55vh]'>
                    {filteredServices
                      .filter((service) => category._id === 'all' || service?.service_category === category)
                      .map((service) => (
                        <Card
                          key={service._id}
                          className='group hover:shadow-md transition-shadow duration-200 h-64'
                        >
                          <CardHeader className='pb-3'>
                            <div className='flex justify-between items-start'>
                              <CardTitle className='line-clamp-1'>{capitalizeFirstLetter(service.name)}</CardTitle>
                            </div>
                            <CardDescription className='text-sm line-clamp-2 mt-1'>{service.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className='space-y-3'>
                              <div className='flex justify-between items-center'>
                                <div className='flex items-center text-muted-foreground text-sm'>
                                  <DollarSign className='h-4 w-4 mr-1' />
                                  <span>Price</span>
                                </div>
                                <span className='font-medium'>{service.cost}</span>
                              </div>
                              <div className='flex justify-between items-center'>
                                <div className='flex items-center text-muted-foreground text-sm'>
                                  <Clock className='h-4 w-4 mr-1' />
                                  <span>Duration</span>
                                </div>
                                <span>{service.duration || '60 min'}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className='flex border-t'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleManageService(service._id)}
                            >
                              <Edit className='h-4 w-4 mr-1' /> Manage
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>

                  {filteredServices.filter((service) => category._id === 'all' || service?.service_category === category).length === 0 && (
                    <div className='text-center py-16 px-4'>
                      <div className='mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4'>
                        <SearchX className='h-6 w-6 text-muted-foreground' />
                      </div>
                      <h3 className='text-lg font-medium'>No services found</h3>
                      <p className='text-muted-foreground mt-2 max-w-md mx-auto'>
                        {searchQuery
                          ? `No services match your search "${searchQuery}" in this category.`
                          : "You don't have any services in this category yet."}
                      </p>
                      <Button
                        variant='outline'
                        className='mt-4'
                        onClick={() => router.push('/dashboard/settings/business-services/new')}
                      >
                        Add service
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
      </InfiniteScrollList>
    </FadeIn>
  );
};
