import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import * as S from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId
  );

  useEffect(() => {
    api.get('providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
      if (date) {
        setSelectedDate(date);
      }
    },
    []
  );

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </S.BackButton>
        <S.HeaderTitle>Cabeleireiros</S.HeaderTitle>
        <S.UseAvatar source={{ uri: user.avatar_url }} />
      </S.Header>

      <S.ProvidersListContainer>
        <S.ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider.id}
          renderItem={({ item: provider }) => (
            <S.ProviderContainer
              onPress={() => handleSelectProvider(provider.id)}
              selected={provider.id === selectedProvider}
            >
              <S.ProviderAvatar source={{ uri: provider.avatar_url }} />
              <S.ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </S.ProviderName>
            </S.ProviderContainer>
          )}
        />
      </S.ProvidersListContainer>

      <S.Calendar>
        <S.Title>Escolha a data</S.Title>

        <S.OpenDatePickerButton onPress={handleToggleDatePicker}>
          <S.OpenDatePickerButtonText>
            Selecionar outra data
          </S.OpenDatePickerButtonText>
        </S.OpenDatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            display="calendar"
            onChange={handleDateChanged}
            textColor="#f4ede8"
            value={selectedDate}
          />
        )}
      </S.Calendar>
    </S.Container>
  );
};

export default CreateAppointment;
