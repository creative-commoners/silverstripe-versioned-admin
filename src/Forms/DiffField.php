<?php

namespace SilverStripe\VersionedAdmin\Forms;

use LogicException;
use SilverStripe\Forms\FormField;

class DiffField extends FormField
{
    protected $fromField;
    protected $toField;
    
    public function __construct($field)
    {
        if (!$field instanceof FormField) {
            throw LogicException('$field is not an instance of ' . FormField::class);
        }
        $this->fromField = $field;
        $fieldClass = get_class($field);
        $this->toField = $fieldClass::create();
        $this->setFailover($this->toField);
    }
    
    public function setFromField($field)
    {
        $this->fromField = $field;
        $this->setFailover($field);
    }
    
    public function getFromField()
    {
        return $this->fromField;
    }
    
    public function setToField($field)
    {
        if (!$field instanceof FormField) {
            throw LogicException('field is not an instance of ' . FormField::class);
        }
        $this->fromField = $field;
        $this->setFailover($field);
    }
    
    public function getToField()
    {
        return $this->fromField;
    }
    
    public function getSchemaComponent()
    {
        return $this->fromField->getSchemaComponent();
    }
    
    public function getSchemaStateDefaults()
    {
        $fromField = $this->getFromField();
        
        $fromValue = $this->$fromField->Value();
        $toValue = $this->Value();
        
        $state = array_merge(
            $fromField->getSchemaStateDefaults(),
            parent::getSchemaStateDefaults()
        );
        $state['data']['diff'] = [
            'from' => $fromValue,
            'to' => $toValue,
        ];
        
        return $state;
    }
}
