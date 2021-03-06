<?php

namespace VisualizationBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Doctrine\Common\Persistence\ObjectManager;
//FORM TYPES
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class GadgetProgressBarType extends AbstractType
{


    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nazwa'
            ])
            ->add('tooltip', CheckboxType::class, [
                'label' => 'Wyświetlać podpowiedź?',
                'required' => false
            ])
            //POZYCJA
            ->add('topPosition', IntegerType::class, [
                'label' => 'Od góry',
                'attr' => [
                    'min' => 0
                ]
            ])
            ->add('leftPosition', IntegerType::class, [
                'label' => 'Od lewej',
                'attr' => [
                    'min' => 0
                ]
            ])
            //ROZMIAR
            ->add('width', IntegerType::class, [
                'label' => 'Szerokość',
                'attr' => [
                    'min' => 0
                ]
            ])
            ->add('rangeMin', NumberType::class, [
                'scale' => 2,
                'label' => 'Zakres min',
                'attr' => [
                    'step' => 0.01
                ]
            ])
            ->add('rangeMax', NumberType::class, [
                'scale' => 2,
                'label' => 'Zakres max',
                'attr' => [
                    'step' => 0.01
                ]
            ])
            ->add('optimumMin', NumberType::class, [
                'scale' => 2,
                'label' => 'Optimum min',
                'attr' => [
                    'step' => 0.01
                ]
            ])
            ->add('optimumMax', NumberType::class, [
                'scale' => 2,
                'label' => 'Optimum max',
                'attr' => [
                    'step' => 0.01
                ]
            ])
            ->add('color1', ColorType::class, [
                'label' => false
            ])
            ->add('color2', ColorType::class, [
                'label' => false
            ])
            ->add('color3', ColorType::class, [
                'label' => false
            ])
            ->add('valueRegisterId', EntityType::class, [
                'label' => 'Wartość',
                'class' => 'BmsConfigurationBundle:Register',
                'empty_data' => null,
                'required' => false,
                'attr' => [
                    'data-live-search' => true
                ]
            ])
            ->add('setRegisterId', EntityType::class, [
                'label' => 'Wartość zadana',
                'class' => 'BmsConfigurationBundle:Register',
                'empty_data' => null,
                'required' => false,
                'attr' => [
                    'data-live-search' => true
                ]
            ]);


    }

}
