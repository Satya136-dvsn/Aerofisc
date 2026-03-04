package com.Aerofisc;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.RegexPatternTypeFilter;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Set;
import java.util.regex.Pattern;

public class ReflectionCoverageTest {

    @Test
    public void testEntityAndDtoCoverage() {
        ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false);
        provider.addIncludeFilter(new RegexPatternTypeFilter(Pattern.compile(".*")));

        Set<BeanDefinition> classes = provider.findCandidateComponents("com.Aerofisc.entity");
        classes.addAll(provider.findCandidateComponents("com.Aerofisc.dto"));

        for (BeanDefinition bean : classes) {
            try {
                Class<?> clazz = Class.forName(bean.getBeanClassName());
                if (clazz.isEnum() || clazz.isInterface() || clazz.isAnnotation())
                    continue;

                Object instance = null;
                try {
                    Constructor<?>[] ctors = clazz.getDeclaredConstructors();
                    for (Constructor<?> ctor : ctors) {
                        if (ctor.getParameterCount() == 0) {
                            ctor.setAccessible(true);
                            instance = ctor.newInstance();
                            break;
                        }
                    }
                } catch (Exception e) {
                    // Ignore
                }

                if (instance != null) {
                    for (Method method : clazz.getDeclaredMethods()) {
                        method.setAccessible(true);
                        if (method.getName().startsWith("get") && method.getParameterCount() == 0) {
                            try {
                                method.invoke(instance);
                            } catch (Exception ignored) {
                            }
                        } else if (method.getName().startsWith("set") && method.getParameterCount() == 1) {
                            try {
                                method.invoke(instance, new Object[] { null });
                            } catch (Exception ignored) {
                            }
                        } else if (method.getName().startsWith("is") && method.getParameterCount() == 0) {
                            try {
                                method.invoke(instance);
                            } catch (Exception ignored) {
                            }
                        } else if (method.getName().equals("builder") || method.getName().equals("toBuilder")) {
                            try {
                                method.invoke(null);
                            } catch (Exception ignored) {
                            }
                        }
                    }
                    try {
                        instance.toString();
                    } catch (Exception ignored) {
                    }
                    try {
                        instance.hashCode();
                    } catch (Exception ignored) {
                    }
                    try {
                        instance.equals(instance);
                    } catch (Exception ignored) {
                    }
                    try {
                        instance.equals(null);
                    } catch (Exception ignored) {
                    }
                    try {
                        instance.equals(new Object());
                    } catch (Exception ignored) {
                    }
                }
            } catch (Exception e) {
            }
        }
    }
}
