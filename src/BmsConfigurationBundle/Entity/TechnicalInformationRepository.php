<?php

namespace BmsConfigurationBundle\Entity;

/**
 * TechnicalInformationRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class TechnicalInformationRepository extends \Doctrine\ORM\EntityRepository
{

    public function getRpiStatus()
    {
        return $this->getEntityManager()
            ->createQuery('SELECT ti.time FROM BmsConfigurationBundle:TechnicalInformation AS ti WHERE ti.name = \'networkConnection\'')
            ->setMaxResults(1)
            ->getResult();
    }

}
