import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import * as S from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { user } = useAuth();
  const { navigate } = useNavigation();

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate]
  );

  useEffect(() => {
    api.get('providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  return (
    <S.Container>
      <S.Header>
        <S.HeaderTitle>
          Bem vindo, {'\n'}
          <S.UserName>{user.name}</S.UserName>
        </S.HeaderTitle>

        <S.ProfileButton onPress={navigateToProfile}>
          <S.UserAvatar source={{ uri: user.avatar_url }} />
        </S.ProfileButton>
      </S.Header>

      <S.ProvidersList
        data={providers}
        keyExtractor={(provider) => provider.id}
        ListHeaderComponent={
          <S.ProvidersListTitle>Cabeleireiros</S.ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <S.ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <S.ProviderAvatar source={{ uri: provider.avatar_url }} />

            <S.ProviderInfo>
              <S.ProviderName>{provider.name}</S.ProviderName>

              <S.ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <S.ProviderMetaText>Segunda à sexta</S.ProviderMetaText>
              </S.ProviderMeta>

              <S.ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <S.ProviderMetaText>8h às 18H</S.ProviderMetaText>
              </S.ProviderMeta>
            </S.ProviderInfo>
          </S.ProviderContainer>
        )}
      />
    </S.Container>
  );
};

export default Dashboard;
