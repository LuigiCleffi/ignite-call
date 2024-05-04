import React, { useEffect } from 'react'
import { Container, Form, FormError, Header } from './styles'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Nome de deve conter no minimo 3 caracteres')
    .regex(/^([a-z\\-]+)$/i, 'Nome de usuário  pode ter apenas letras e hifens')
    .transform((val) => val.toLowerCase()),
  name: z.string().min(3, 'Nome de deve conter no minimo 3 caracteres'),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username))
    }
    return () => resetField('username')
  }, [router.query.username, setValue, resetField])

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await api.post('/users', {
        username: data.username,
        name: data.name,
      })
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
        return
      }
      console.error(err)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações a qualquer momento.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>
      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label htmlFor="">
          <Text size="sm">Nome do usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />
          {errors.username && <FormError>{errors.username.message}</FormError>}
        </label>

        <label htmlFor="">
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />
          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
        </Button>
      </Form>
    </Container>
  )
}
